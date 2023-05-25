import { useContext, useState } from "react";
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../../Shared/Helpers/Misc";
import { post } from "../../../../../Shared/Helpers/Request";
import { AdminApi } from "../../../../Config/AdminApi";
import { OrderContext } from "../../../../Context/OrderContext";

export default function EditOrderPrice({order, setOrder}){
    // const {order, setOrder} = useContext(OrderContext)

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const [data, setData] = useState({
        amount: ''
    })

    function onSubmit(event){
        event.preventDefault()

        let message = 'This will update the main order price you will receive from ' + order.source.name +
            ' to ' + parseFloat(data.amount).toLocaleString()

        confirmAction(
            {
                title: 'Edit Order Price',
                message: message
            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        post(generateUrl(AdminApi.EDIT_ORDER_PRICE, {order_id: order.id}), data)
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
                        <h2 className="heading-title mb-0 font-weight-700">Edit Order Price</h2>
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
                                <label><strong>New Order Price</strong></label>
                                <input className="form-control" type="number" value={data.amount} onChange={(e) => setData({...data, amount: e.target.value})} placeholder="" required />
                                {
                                    result.errors != undefined && result.errors.amount != undefined ?
                                    <span className="text-danger">{result.errors.amount}</span>
                                    :<span></span>
                                }
                            </div>

                            <button className="btn btn-default btn-block shadow-none">Update Order Price</button>
                        </form>

                    </div>

                </div>

            </div>
        );

}
