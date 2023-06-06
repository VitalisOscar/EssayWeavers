import { useContext, useState } from "react";
import Flatpickr from "react-flatpickr";
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../../Shared/Helpers/Misc";
import { post } from "../../../../../Shared/Helpers/Request";
import { AdminApi } from "../../../../Config/AdminApi";
import { useWriters } from "../../../../Hooks/Writers";
import { format } from "date-fns";
import { useOrderMetricsProfit, useOrderMetricsTimeToDeadline } from "../../../../Hooks/Order";
import { OrderContext } from "../../../../Context/OrderContext";

export default function AllocateOrder(){
    const {order, setOrder} = useContext(OrderContext)

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const [data, setData] = useState(resetData())

    const writers = useWriters()

    const profit = useOrderMetricsProfit(
        (parseFloat(order.price_raw) - parseFloat(order.bidder_commission)),
        data.writer_price
    )
    const reviewTime = useOrderMetricsTimeToDeadline(order.deadline_raw, data.writer_deadline)

    let selectedWriterName = ' the selected writer'
    if(data.writer != ''){
        if(writers.find(writer => writer.id == data.writer) != undefined){
            selectedWriterName = writers.find(writer => writer.id == data.writer).name.split(' ')[0]
        }
    }

    function resetData(){
        return {
            writer: order.current_writer ? order.current_writer.id : '',
            writer_price: order.current_writer ? order.writer_price_raw : '',
            writer_price_type: 'calculated',
            writer_deadline: order.current_writer ?
                parseDate(new Date(order.writer_deadline_raw)) : ''
        }
    }

    function parseDate(date){
        date = format(date, 'yyyy-MM-dd HH:ii')
        return date
    }

    function setWriterPrice(val){
        data.writer_price = val

        // We fix the price, i.e will not be calculated based on cpp
        data.writer_price_type = 'fixed'

        setData({...data})
    }

    function setWriter(val){
        data.writer = val

        // If price needs to be calculated from cpp, we adjust the price
        if(data.writer != '' && data.writer_price_type == 'calculated'){
            calculateWriterPrice()
        }

        setData({...data})
    }

    function calculateWriterPrice(){
        if(data.writer != '' && order.pages) {
            let writer = writers.find(w => w.id == data.writer)
            if(writer && writer.cpp){
                data.writer_price = Math.round(writer.cpp * order.pages)
                return
            }
        }

        data.writer_price = ''
    }

    function onSubmit(event){
        event.preventDefault()

        confirmAction(
            {
                title: order.current_writer ? 'Update allocation' : 'Allocate order',
                message: order.current_writer ?
                    'This will update the current allocation for this order' :
                    'A new allocation for this order to ' + selectedWriterName + ' will be created'
            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        post(generateUrl(AdminApi.ALLOCATE_ORDER, {order_id: order.id}), data)
            .then(result => {
                setResult(result)
                setPosting(false)

                if(result.success){
                    showSuccess(result.status)
                    setOrder({...result.data})
                    setData({...resetData()})
                }else{
                    showError(result.status)
                }
            })
            .catch(error => {
                console.log(error)
                setPosting(false)

                showError('An exception occurred')
            })
    }

    return (
            <div className="col-lg-9 col-lg-6 col-xl-12 mx-auto">
                {/* FORM */}
                <h2 className="heading-title font-weight-700">
                    {order.current_writer ? 'Update Allocation' : 'Allocate Order'}
                </h2>

                <div className="card border shadow-none has-loader">

                    {
                        posting ?
                        <div className="loader py-3 d-flex align-items-center justify-content-center">
                            <div className="d-flex align-items-center">
                                <div className="spinner-border text-primary mr-3"></div>
                                <div>Please wait...</div>
                            </div>
                        </div>
                        :
                        <div></div>
                    }

                    <form onSubmit={onSubmit} autoComplete="off">

                        <div className="card-body">
                            <div className="row">

                                <div className="col-md-12 col-xl-4">
                                    <div className="form-group mb-xl-0">
                                        <label><strong>Writer</strong></label>
                                        <select className="form-control" value={data.writer} onChange={(e) => setWriter(e.target.value)} required>
                                            <option value="">Select a value</option>
                                            {
                                                writers.map(opt =>
                                                    <option value={opt.id} key={opt.id}>{opt.name}</option>
                                                )
                                            }
                                        </select>
                                        {
                                            result.errors != undefined && result.errors.writer != undefined ?
                                            <span className="text-danger">{result.errors.writer}</span>
                                            :<span>The writer who will be allocated the order</span>
                                        }
                                    </div>
                                </div>

                                <div className="col-md-12 col-xl-4">
                                    <div className="form-group mb-xl-0">
                                        <label><strong>Writer's Payment</strong></label>
                                        <input placeholder={order.price_raw - order.bidder_commission} className="form-control" type="number" value={data.writer_price} onChange={(e) => setWriterPrice(e.target.value)} required />
                                        {
                                            result.errors != undefined && result.errors.writer_price != undefined ?
                                            <span className="text-danger">{result.errors.writer_price}</span>
                                            :<span>This is the payment that will be earned by {selectedWriterName} for this order</span>
                                        }
                                    </div>
                                </div>

                                <div className="col-md-12 col-xl-4">
                                    <div className="form-group mb-xl-0">
                                        <label><strong>Writer's Deadline</strong></label>
                                        <Flatpickr
                                            value={data.writer_deadline}
                                            className="form-control flatpickr"
                                            placeholder={order.deadline_formatted}
                                            onClose={date => {
                                                setData({ ...data, writer_deadline: parseDate(date[0]) })
                                            }}
                                            options={{
                                                enableTime: true,
                                                dateFormat: "Y-m-d H:i",
                                                altInput: true,
                                                altFormat: "j F Y H:i",
                                                minDate: 'today'
                                            }}
                                        />
                                        {
                                            result.errors != undefined && result.errors.writer_deadline != undefined ?
                                            <span className="text-danger">{result.errors.writer_deadline}</span>
                                            :<span>This is the deadline that {selectedWriterName} will need to submit the order on or before</span>
                                        }
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="card-body border-top">

                            <h2 className="heading font-weight-700 mb-4 d-none text-primary">Quick Metrics</h2>

                            <div className="row">

                                <div className="col-md-12 col-xl-4">
                                    <div className="mb-3 mb-xl-0 d-flex align-items-start">
                                        <i className="fa fa-coins icon colored-icon bg-warning"></i>
                                        <div>
                                            <div className="d-flex align-items-center mb-3">
                                                <strong style={{fontSize: '1.1em'}} className="mr-2">Your Profit Share: </strong>
                                                <strong style={{fontSize: '1.1em'}} className={profit > 0 ? 'text-success' : (profit < 0 ? 'text-danger' : '')}>{profit.toLocaleString()}</strong>
                                            </div>

                                            <div className="mb-3">
                                                {
                                                    'This is the amount you will remain with after paying the writer their share based on what you will receive from the source (' + order.source.name + ')'
                                                    + (order.bidder_commission > 0 ? (' and after you pay the bidder their commission (' + order.bidder_commission_formatted + ')') : '')
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12 col-xl-4">
                                    <div className="mb-3 mb-xl-0 d-flex align-items-start">
                                        <i className="fa fa-calendar-o icon colored-icon bg-indigo"></i>
                                        <div>
                                            <div className="d-flex align-items-center mb-3">
                                                <strong style={{fontSize: '1.1em'}} className="mr-2">Review Time: </strong>
                                                <strong style={{fontSize: '1.1em'}} className={reviewTime.positive ? 'text-success' : 'text-danger'}>{reviewTime.difference}</strong>
                                            </div>

                                            <div className="mb-3">
                                                This is the time you have to review the work submitted by the writer before the main order deadline elapses
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12 col-xl-4">
                                    <div className="mb-3">
                                        Once allocated, {selectedWriterName} will be able to either
                                        accept or decline the order. If accepted, the order will
                                        move to an 'In Progress' status. Otherwise, you'll be able to
                                        allocate it afresh
                                    </div>

                                    <button className="btn btn-default btn-block shadow-none">
                                    {order.current_writer ? 'Update Allocation' : 'Allocate Order'}
                                    </button>
                                </div>

                            </div>

                        </div>

                    </form>

                </div>

            </div>
        );

}
