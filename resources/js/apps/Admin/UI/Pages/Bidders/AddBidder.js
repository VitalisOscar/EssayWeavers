import { useContext, useEffect, useState } from "react";
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../Shared/Helpers/Misc";
import { post } from "../../../../Shared/Helpers/Request";
import { AdminApi } from "../../../Config/AdminApi";
import { AdminContext } from "../../../Context/AdminContext";

export default function AddBidder(){
    const {adminData, setAdminData} = useContext(AdminContext)
    useEffect(() => {
        setAdminData({
            ...adminData,
            pageTitle: 'Add Bidder',
            headerName: 'Add Bidder',
            headerIcon: 'fas fa-plus',
        })
    }, [])

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const [data, setData] = useState({
        commission_rate: '',
        name: ''
    })

    function onSubmit(event){
        event.preventDefault()

        confirmAction(
            {
                title: 'Add Bidder',
                message: 'Please confirm addition of the bidder to the platform'
            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        post(generateUrl(AdminApi.ADD_BIDDER), data)
            .then(result => {
                setResult(result)
                setPosting(false)

                if(result.success){
                    showSuccess(result.status)

                    // Reset data
                    setData({
                        commission_rate: '',
                        name: ''
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
                        <h2 className="heading-title mb-0 font-weight-700">Add Bidder</h2>
                    </div>

                    <div className="card-body">

                        <form onSubmit={onSubmit} autoComplete="off">

                            <div className="form-group">
                                <label>Name</label>
                                <input className="form-control" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} placeholder="e.g James Maina" required />
                                {
                                    result.errors != undefined && result.errors.name != undefined ?
                                    <span className="text-danger">{result.errors.name}</span>
                                    :<span></span>
                                }
                            </div>

                            <div className="form-group">
                                <label>Commission Rate</label>
                                <input className="form-control" value={data.commission_rate} onChange={(e) => setData({...data, commission_rate: e.target.value})} placeholder="e.g 10" required />
                                {
                                    result.errors != undefined && result.errors.commission_rate != undefined ?
                                        <span className="text-danger">{result.errors.commission_rate}</span>
                                        :<span>This is the default percentage the bidder will earn for orders they have bid</span>
                                }
                            </div>

                            <button className="btn btn-default btn-block shadow-none">Save Bidder</button>
                        </form>

                    </div>

                </div>
                {/* END FORM */}
            </div>
        );

}
