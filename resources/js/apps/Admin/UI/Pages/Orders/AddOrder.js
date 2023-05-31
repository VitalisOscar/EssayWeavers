import { useContext, useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../Shared/Helpers/Misc";
import { post } from "../../../../Shared/Helpers/Request";
import { AdminApi } from "../../../Config/AdminApi";
import { useSources } from "../../../Hooks/Sources";
import { useWriters } from "../../../Hooks/Writers";
import FileHandler from "../../../../Shared/Components/FileHandler";
import { format } from "date-fns";
import TextEditor from "../../../../Shared/Components/TextEditor";
import { AdminContext } from "../../../Context/AdminContext";
import {useBidders} from "../../../Hooks/Bidders";

export default function AddOrder(){
    const {adminData, setAdminData} = useContext(AdminContext)
    useEffect(() => {
        setAdminData({
            ...adminData,
            pageTitle: 'Add Order',
            headerName: 'Add Order',
            headerIcon: 'fas fa-plus',
        })
    }, [])

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    let freshData = resetData()
    const [data, setData] = useState({...freshData})
    const [attachedFiles, setAttachedFiles] = useState([])
    const [isAllocating, setIsAllocating] = useState(false)

    const writers = useWriters()
    const sources = useSources()
    const bidders = useBidders()

    let selectedSourceName = ' the selected source'
    if(data.source != ''){
        if(sources.find(source => source.id == data.source) != undefined){
            selectedSourceName = sources.find(source => source.id == data.source).name
        }
    }

    let selectedWriterName = ' the selected writer'
    if(data.writer != ''){
        if(writers.find(writer => writer.id == data.writer) != undefined){
            selectedWriterName = writers.find(writer => writer.id == data.writer).name.split(' ')[0]
        }
    }

    let selectedBidderName = ' the selected bidder'
    if(data.bidder != ''){
        if(bidders.find(bidder => bidder.id == data.bidder) != undefined){
            selectedBidderName = bidders.find(bidder => bidder.id == data.bidder).name.split(' ')[0]
        }
    }

    function resetData(){
        return {
            title: '',
            requirements: '',
            deadline: '',
            price: '',
            source: '',
            bidder: '',
            bidder_commission: '',
            bidder_commission_type: 'calculated',
            writer: '',
            writer_price: '',
            writer_deadline: '',
            pages: ''
        }
    }

    function parseDate(date){
        date = format(date, 'yyyy-MM-dd HH:ii')
        return date
    }

    function setBidderCommission(val){
        data.bidder_commission = val

        // We fix the commission, i.e will not be calculated based on rate
        data.bidder_commission_type = 'fixed'

        setData({...data})
    }

    function setOrderPrice(val){
        data.price = val

        // If bidder is selected and the commission needs to be calculated, we adjust it
        if(data.bidder != '' && data.bidder_commission_type == 'calculated'){
            calculateBidderCommission()
        }

        setData({...data})
    }

    function setBidder(val){
        data.bidder = val

        // Since a new bidder was selected, the commission
        // will be calculated afresh based on the rate of the bidder
        data.bidder_commission_type = 'calculated'

        calculateBidderCommission()
        setData({...data})
    }

    function calculateBidderCommission(){
        if(data.bidder != '') {
            let bidder = bidders.find(b => b.id == data.bidder)
            data.bidder_commission = Math.round(0.01 * bidder.commission_rate * data.price)
        }else{
            data.bidder_commission = ''
        }
    }

    function onSubmit(event){
        event.preventDefault()

        confirmAction(
            {
                title: 'Add Order',
                message: 'Confirm that you wish to add the order from the provided details'
            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        let formData = new FormData();

        // Add data
        for(const key in data){
            formData.append(key, data[key])
        }

        // Add attachments
        for(let i=0; i < attachedFiles.length; i++){
            formData.append('attachments[' + i + ']', attachedFiles[i]);
        }

        post(generateUrl(AdminApi.ADD_ORDER), formData)
            .then(result => {
                setResult(result)
                setPosting(false)

                if(result.success){
                    showSuccess(result.status)

                    // Reset data
                    let data = resetData()
                    setData({...data})
                    setAttachedFiles([])
                    setIsAllocating(false)
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
            <div className="col-lg-9 col-lg-6col-xl-5 mx-auto">
                {/* FORM */}
                <div className="card content-card has-loader">

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

                    <div className="card-header rounded-top d-flex align-items-center" style={{background: '#f6f9fc'}}>
                        <h2 className="heading-title mb-0 font-weight-700">Add Order</h2>
                    </div>

                    <form onSubmit={onSubmit} autoComplete="off">

                        <div className="card-body">

                            <div className="row">

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label><strong>Order Title</strong></label>
                                        <input className="form-control" type="text" value={data.title} onChange={(e) => setData({...data, title: e.target.value})} placeholder="" required />
                                        {
                                            result.errors != undefined && result.errors.title != undefined ?
                                            <span className="text-danger">{result.errors.title}</span>
                                            :<span>Will help you identify the order</span>
                                        }
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label><strong>Source</strong></label>
                                        <select className="form-control" value={data.source} onChange={(e) => setData({...data, source: e.target.value})} required>
                                            <option value="">Select a value</option>
                                            {
                                                sources.map(opt =>
                                                    <option value={opt.id} key={opt.id}>{opt.name}</option>
                                                )
                                            }
                                        </select>
                                        {
                                            result.errors != undefined && result.errors.source != undefined ?
                                            <span className="text-danger">{result.errors.source}</span>
                                            :<span>Helps in tracking where your orders originate and should go</span>
                                        }
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label><strong>Payment</strong></label>
                                        <input className="form-control" type="number" value={data.price} onChange={(e) => setOrderPrice(e.target.value)} placeholder="" required />
                                        {
                                            result.errors != undefined && result.errors.price != undefined ?
                                            <span className="text-danger">{result.errors.price}</span>
                                            :<span>This is the payment you will receive from {selectedSourceName} for this order</span>
                                        }
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label><strong>Deadline</strong></label>
                                        <Flatpickr
                                            value={data.deadline}
                                            className="form-control flatpickr"
                                            onClose={date => {
                                                setData({ ...data, deadline: parseDate(date[0]) })
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
                                            result.errors != undefined && result.errors.deadline != undefined ?
                                            <span className="text-danger">{result.errors.deadline}</span>
                                            :<span>This is the deadline of submitting the order back to {selectedSourceName}. You can issue your writers different deadlines</span>
                                        }
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label><strong>Bidder</strong></label>
                                        <select className="form-control" value={data.bidder} onChange={(e) => setBidder(e.target.value)}>
                                            <option value="">Select a value</option>
                                            {
                                                bidders.map(opt =>
                                                    <option value={opt.id} key={opt.id}>{opt.name}</option>
                                                )
                                            }
                                        </select>
                                        {
                                            result.errors != undefined && result.errors.bidder != undefined ?
                                                <span className="text-danger">{result.errors.bidder}</span>
                                                :<span>Helps in tracking who placed the bid for the order on {selectedSourceName}</span>
                                        }
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label><strong>Bidder Commission</strong></label>
                                        <input className="form-control" type="number" value={data.bidder_commission} onInput={(e) => setBidderCommission(e.target.value)} placeholder="" />
                                        {
                                            result.errors != undefined && result.errors.bidder_commission != undefined ?
                                                <span className="text-danger">{result.errors.bidder_commission}</span>
                                                :<span>This is the commission amount you will pay {selectedBidderName} for placing a bid for this order</span>
                                        }
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label><strong>Pages Required</strong></label>
                                        <input className="form-control" type="number" value={data.pages} onChange={(e) => setData({...data, pages: e.target.value})} placeholder="" />
                                        {
                                            result.errors != undefined && result.errors.pages != undefined ?
                                                <span className="text-danger">{result.errors.pages}</span>
                                                :<span></span>
                                        }
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label><strong>More Requirements</strong></label>
                                        <TextEditor
                                            text={data.requirements}
                                            onChange={(text) => {
                                                setData({...data, requirements: text})
                                            }}
                                        />
                                        {
                                            result.errors != undefined && result.errors.requirements != undefined ?
                                            <span className="text-danger">{result.errors.requirements}</span>
                                            :<span>You can add any requirements or instructions to the writer here</span>
                                        }
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-group mb-0">
                                        <label><strong>Attachments</strong></label>

                                        <FileHandler onChange={setAttachedFiles} />

                                        {
                                            result.errors != undefined && result.errors.attachments != undefined ?
                                            <span className="text-danger">{result.errors.attachments}</span>
                                            :<span></span>
                                        }
                                    </div>
                                </div>

                            </div>

                        </div>


                        <div className="card-body border-top" style={{ background: '#00800005' }}>
                            <div className="row">

                                <div className="col-md-12">
                                    <div className="form-group">
                                        <h4><strong>Allocate Order</strong></h4>

                                        <p>
                                            You can save this order and allocate to a writer at a later time.
                                            If you wish to allocate the order now, tick the checkbox below
                                        </p>

                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox" id="allocate" className="custom-control-input" checked={isAllocating} onChange={(e) => setIsAllocating(!isAllocating)} />
                                            <label htmlFor="allocate" className="custom-control-label">
                                                <span>Allocate order now</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {
                                    isAllocating ?
                                    <>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label><strong>Allocated Writer</strong></label>
                                                <select className="form-control" value={data.writer} onChange={(e) => setData({...data, writer: e.target.value})} required>
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

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label><strong>Writer's Payment</strong></label>
                                                <input className="form-control" type="number" value={data.writer_price} onChange={(e) => setData({...data, writer_price: e.target.value})} placeholder="" required />
                                                {
                                                    result.errors != undefined && result.errors.writer_price != undefined ?
                                                    <span className="text-danger">{result.errors.writer_price}</span>
                                                    :<span>This is the payment that will be earned by {selectedWriterName} for this order</span>
                                                }
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label><strong>Writer's Deadline</strong></label>
                                                <Flatpickr
                                                    value={data.writer_deadline}
                                                    className="form-control flatpickr"
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

                                    </>
                                    : <></>
                                }

                            </div>

                            <button className="btn btn-default btn-block shadow-none">Add Order</button>
                        </div>

                    </form>

                </div>
                {/* END FORM */}
            </div>
        );

}
