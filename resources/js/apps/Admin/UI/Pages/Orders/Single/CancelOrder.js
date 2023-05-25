import { useContext, useState } from "react";
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../../Shared/Helpers/Misc";
import { post } from "../../../../../Shared/Helpers/Request";
import { AdminApi } from "../../../../Config/AdminApi";
import { OrderContext } from "../../../../Context/OrderContext";

export default function CancelOrder({order, setOrder}){
    // const {order, setOrder} = useContext(OrderContext)

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const [reason, setReason] = useState('')

    const sampleReasons = [
        'Order was cancelled by the student',
        'Order cancellation was requested by the writer',
        'Order was rejected due to late submission',
        'Order was wrongly assigned',
    ]

    function onSubmit(event){
        event.preventDefault()

        let message = (
            order.status == 'New' ? 'This will mark the order as cancelled. You will not be able to allocate to a writer' :
                (
                    order.status == 'Allocated' ? 'This will mark the order as cancelled and delete any associated allocations' :
                        (
                            order.status == 'Active' ?
                                'This order is already in progress. The order plus all earnings will be marked as cancelled' :
                                    'This order already has a submission. The order plus all earnings will be marked as cancelled'
                        )
                )
        )

        confirmAction(
            {
                title: 'Cancel Order',
                message: message
            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        post(generateUrl(AdminApi.CANCEL_ORDER, {order_id: order.id}), {reason: reason})
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
                        <h2 className="heading-title mb-0 font-weight-700">Cancel Order</h2>
                        <span className="close" data-dismiss="modal">
                            <i className="fa fa-times"></i>
                        </span>
                    </div>

                    <div className="modal-body">

                        <form onSubmit={onSubmit} autoComplete="off">
                            <div className="form-group">
                                <label><strong>Cancellation Reason</strong></label>
                                <select className="form-control" value={reason} onChange={(e) => setReason(e.target.value)} required>
                                    <option value="">Select a reason</option>
                                    {
                                        sampleReasons.map((reason, index) => <option key={index} value={reason}>{reason}</option>)
                                    }
                                </select>
                                {
                                    result.errors != undefined && result.errors.reason != undefined ?
                                    <span className="text-danger">{result.errors.reason}</span>
                                    :<span></span>
                                }
                            </div>

                            <button className="btn btn-default btn-block shadow-none">Cancel Order</button>
                        </form>

                    </div>

                </div>

            </div>
        );

}
