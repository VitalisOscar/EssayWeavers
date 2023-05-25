import { useContext, useState } from "react";
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../../Shared/Helpers/Misc";
import { post } from "../../../../../Shared/Helpers/Request";
import { AdminApi } from "../../../../Config/AdminApi";
import { OrderContext } from "../../../../Context/OrderContext";

export default function AddPayment({order, setOrder}){
    // const {order, setOrder} = useContext(OrderContext)

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const [data, setData] = useState({
        amount: '',
        type: ''
    })

    function onSubmit(event){
        event.preventDefault()

        let message = (
                        order.status == 'Active' || order.status == 'Completed' ?
                            'A new pending payment will be added to this order. Once the order is settled, the payment will be cleared with the previous order payments' :
                                'Since this order is already settled, the new payment will be added to the writer account straight away'
                        )

        confirmAction(
            {
                title: 'Add Order Payment',
                message: message
            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        post(generateUrl(AdminApi.ADD_PAYMENT, {order_id: order.id}), data)
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
                        <h2 className="heading-title mb-0 font-weight-700">Add Payment</h2>
                        <span className="close" data-dismiss="modal">
                            <i className="fa fa-times"></i>
                        </span>
                    </div>

                    <div className="modal-body">

                        <p>
                            This is an additional payment that will be added to the writer account
                        </p>

                        <form onSubmit={onSubmit} autoComplete="off">
                            <div className="form-group">
                                <label><strong>Amount</strong></label>
                                <input className="form-control" type="number" value={data.amount} onChange={(e) => setData({...data, amount: e.target.value})} placeholder="" required />
                                {
                                    result.errors != undefined && result.errors.amount != undefined ?
                                    <span className="text-danger">{result.errors.amount}</span>
                                    :<span></span>
                                }
                            </div>

                            <div className="form-group">
                                <label><strong>Payment Type</strong></label>
                                <select className="form-control" value={data.type} onChange={(e) => setData({...data, type: e.target.value})} required>
                                    <option value="">Select payment type</option>
                                    <option value="Supplementary Payment">Supplementary Payment</option>
                                    <option value="Tip">Tip</option>
                                </select>
                                {
                                    result.errors != undefined && result.errors.type != undefined ?
                                    <span className="text-danger">{result.errors.type}</span>
                                    :<span></span>
                                }
                            </div>

                            <button className="btn btn-default btn-block shadow-none">Add Payment</button>
                        </form>

                    </div>

                </div>

            </div>
        );

}
