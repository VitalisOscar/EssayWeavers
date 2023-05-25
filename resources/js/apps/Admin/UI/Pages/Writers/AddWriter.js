import { useContext, useEffect, useState } from "react";
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../Shared/Helpers/Misc";
import { post } from "../../../../Shared/Helpers/Request";
import { AdminApi } from "../../../Config/AdminApi";
import { AdminContext } from "../../../Context/AdminContext";

export default function AddWriter(){
    const {adminData, setAdminData} = useContext(AdminContext)
    useEffect(() => {
        setAdminData({
            ...adminData,
            pageTitle: 'Add Writer Account',
            headerName: 'Add Writer Account',
            headerIcon: 'fas fa-user-plus',
        })
    }, [])

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const [data, setData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    })

    function onSubmit(event){
        event.preventDefault()

        confirmAction(
            {
                title: 'Add Writer',
                message: 'Please confirm addition of the writer account to the platform'
            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        post(generateUrl(AdminApi.ADD_WRITER), data)
            .then(result => {
                setResult(result)
                setPosting(false)

                if(result.success){
                    showSuccess(result.status)

                    // Reset data
                    setData({
                        name: '',
                        email: '',
                        phone: '',
                        password: ''
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
                        <h2 className="heading-title mb-0 font-weight-700">Add Writer</h2>
                    </div>

                    <div className="card-body">

                        <form onSubmit={onSubmit} autoComplete="off">
                            <div className="form-group">
                                <label>Name</label>
                                <input className="form-control" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} placeholder="Name" required />
                                {
                                    result.errors != undefined && result.errors.name != undefined ?
                                    <span className="text-danger">{result.errors.name}</span>
                                    :<span></span>
                                }
                            </div>

                            <div className="form-group">
                                <label>Phone</label>
                                <input className="form-control" type="phone" value={data.phone} onChange={(e) => setData({...data, phone: e.target.value})} placeholder="Phone" required />
                                {
                                    result.errors != undefined && result.errors.phone != undefined ?
                                    <span className="text-danger">{result.errors.phone}</span>
                                    :<span></span>
                                }
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input className="form-control" type="email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})} placeholder="Email" required />
                                {
                                    result.errors != undefined && result.errors.email != undefined ?
                                    <span className="text-danger">{result.errors.email}</span>
                                    :<span></span>
                                }
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input className="form-control" type="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} placeholder="Password" required />
                                {
                                    result.errors != undefined && result.errors.password != undefined ?
                                    <span className="text-danger">{result.errors.password}</span>
                                    :<span></span>
                                }
                            </div>

                            <button className="btn btn-default btn-block shadow-none">Add&nbsp;Writer</button>
                        </form>

                    </div>

                </div>
                {/* END FORM */}
            </div>
        );

}
