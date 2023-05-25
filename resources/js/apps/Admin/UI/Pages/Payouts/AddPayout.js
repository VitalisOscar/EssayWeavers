import { useContext, useEffect, useState } from "react";
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../Shared/Helpers/Misc";
import { post } from "../../../../Shared/Helpers/Request";
import { AdminApi } from "../../../Config/AdminApi";
import { AdminContext } from "../../../Context/AdminContext";
import { usePaymentRecepients, usePaymentRecepientTypes } from "../../../Hooks/Payments";

export default function AddPayout(){
    const {adminData, setAdminData} = useContext(AdminContext)
    useEffect(() => {
        setAdminData({
            ...adminData,
            pageTitle: 'Add Payout',
            headerName: 'Add Payout',
            headerIcon: 'fas fa-money-bill',
        })
    }, [])

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const [data, setData] = useState({
        recepient_type: '',
        recepient_id: '',
        amount: ''
    })

    const recepientTypes = usePaymentRecepientTypes()
    const recepients = usePaymentRecepients(data.recepient_type)

    let selectedRecepientName = 'the selected recepient'

    let recepientAccount = {}

    if(data.recepient_id != ''){
        if(recepients.find(r => r.id == data.recepient_id) != undefined){
            let recepient = recepients.find(r => r.id == data.recepient_id)

            selectedRecepientName = recepient.name.split(' ')[0]
            recepientAccount = recepient.accounts ? recepient.accounts : {}
        }
    }

    function onSubmit(event){
        event.preventDefault()

        confirmAction(
            {
                title: 'Add Payout',
                message: 'Confirm the payout of ' + parseInt(data.amount).toLocaleString() +
                    ' to ' + selectedRecepientName + '. The amount shall be updated to the account'
            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        post(generateUrl(AdminApi.ADD_PAYOUT), data)
            .then(result => {
                setResult(result)
                setPosting(false)

                if(result.success){
                    showSuccess(result.status)

                    // Reset data
                    setData({
                        recepient_type: '',
                        recepient_id: '',
                        amount: ''
                    })
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
            <div className="col-md-8 col-lg-6 col-xl-5 mx-auto">
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
                        <h2 className="heading-title mb-0 font-weight-700">Add Payout</h2>
                    </div>

                    <div className="card-body">

                        <form onSubmit={onSubmit} autoComplete="off">
                            <div className="form-group">
                                <label><strong>Recepient Type</strong></label>
                                <select className="form-control" value={data.recepient_type} onChange={(e) => setData({...data, recepient_type: e.target.value})} required>
                                    <option value="">Select a value</option>
                                    {
                                        recepientTypes.map(type =>
                                            <option value={type} key={type}>{type}</option>
                                        )
                                    }
                                </select>
                                {
                                    result.errors != undefined && result.errors.recepient_type != undefined ?
                                    <span className="text-danger">{result.errors.recepient_type}</span>
                                    :<span></span>
                                }
                            </div>

                            <div className="form-group">
                                <label><strong>Recepient</strong></label>
                                <select className="form-control" value={data.recepient_id} onChange={(e) => setData({...data, recepient_id: e.target.value})} required>
                                    <option value="">Select a value</option>
                                    {
                                        recepients.map(option =>
                                            <option value={option.id} key={option.id}>
                                                {option.name + (option.phone != undefined ? (' (' + option.phone + ')'):'')}
                                            </option>
                                        )
                                    }
                                </select>
                                {
                                    result.errors != undefined && result.errors.recepient_id != undefined ?
                                    <span className="text-danger">{result.errors.recepient_id}</span>
                                    :<span></span>
                                }
                            </div>

                            <div className="form-group">
                                <label><strong>Amount Paid</strong></label>
                                &nbsp;&nbsp;
                                {
                                    data.recepient_id != '' ?
                                    (
                                        recepientAccount.available < parseInt(data.amount) ?
                                        <span className="text-danger">(Available: {recepientAccount.available_formatted})</span>
                                        :
                                        (
                                            data.amount != '' && recepientAccount.available >= parseInt(data.amount) ?
                                            <span className="text-success">(Available: {recepientAccount.available_formatted})</span>
                                            :<span className="text-dark">(Available: {recepientAccount.available_formatted})</span>
                                        )
                                    ) : <></>

                                }
                                <input className="form-control" type="number" value={data.amount} onChange={(e) => setData({...data, amount: e.target.value})} placeholder="in KES" required />
                                {
                                    result.errors != undefined && result.errors.amount != undefined ?
                                    <span className="text-danger">{result.errors.amount}</span>
                                    :<span></span>
                                }
                            </div>

                            <button className="btn btn-default btn-block shadow-none">Save Payout</button>
                        </form>

                    </div>

                </div>
                {/* END FORM */}
            </div>
        );

}
