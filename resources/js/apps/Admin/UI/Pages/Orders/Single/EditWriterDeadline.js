import { format } from "date-fns";
import { useContext, useState } from "react";
import Flatpickr from "react-flatpickr";
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../../Shared/Helpers/Misc";
import { post } from "../../../../../Shared/Helpers/Request";
import { AdminApi } from "../../../../Config/AdminApi";
import { OrderContext } from "../../../../Context/OrderContext";

export default function EditWriterDeadline({order, setOrder}){
    // const {order, setOrder} = useContext(OrderContext)

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const [data, setData] = useState({
        deadline: ''
    })

    function parseDate(date){
        date = format(date, 'yyyy-MM-dd HH:ii')
        return date
    }

    function onSubmit(event){
        event.preventDefault()

        let message = 'This will update the deadline given to the current writer '

        confirmAction(
            {
                title: 'Updat Writer Deadline',
                message: message
            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        post(generateUrl(AdminApi.EDIT_WRITER_DEADLINE, {order_id: order.id}), data)
            .then(result => {
                setResult(result)
                setPosting(false)

                if(result.success){
                    showSuccess(result.status)
                    if(setOrder) setOrder(result.data)
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
            <div>
                {/* FORM */}

                <div className="has-loader">

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

                    <div className="modal-header d-flex align-items-center" style={{background: '#f6f9fc'}}>
                        <h2 className="heading-title mb-0 font-weight-700">Update Writer Deadline</h2>
                        <span className="close" data-dismiss="modal">
                            <i className="fa fa-times"></i>
                        </span>
                    </div>

                    <div className="modal-body">

                        <p>
                            This shall be updated as the total order price that will be received from {order.source.name} upon order completion
                        </p>

                        <form onSubmit={onSubmit} autoComplete="off">
                            <div className="form-group">
                                <label><strong>New Deadline</strong></label>
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
                                        minDate: 'today',
                                    }}
                                />
                                {
                                    result.errors != undefined && result.errors.amount != undefined ?
                                    <span className="text-danger">{result.errors.amount}</span>
                                    :<span></span>
                                }
                            </div>

                            <button className="btn btn-default btn-block shadow-none">Update Writer Deadline</button>
                        </form>

                    </div>

                </div>

            </div>
        );

}
