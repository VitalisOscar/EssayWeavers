import { useState } from "react";
import { generateUrl, showError, showSuccess, confirmAction } from "../../Helpers/Misc";
import { post } from "../../Helpers/Request";

export default function UpdatePassword({ guard }){

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const [data, setData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    })

    function onSubmit(event){
        event.preventDefault()

        if(data.new_password != data.confirm_password){
            return;
        }

        confirmAction(
            {
                title: 'Update Password',
                message: "This action will update the password you use to log in"
            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        post(generateUrl('/account/update-password/' + guard), data)
            .then(result => {
                setResult(result)
                setPosting(false)

                if(result.success){
                    showSuccess(result.status)

                    // Reset data
                    setData({
                        current_password: '',
                        new_password: '',
                        confirm_password: ''
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
                        <h2 className="heading-title mb-0 font-weight-700">Update your Password</h2>
                    </div>

                    <div className="card-body">

                        <form onSubmit={onSubmit} autoComplete="off">

                            <div className="form-group">
                                <label><strong>Current Password:</strong></label>
                                <input className="form-control" type="password" value={data.current_password} onChange={(e) => setData({...data, current_password: e.target.value})} required />
                                {
                                    result.errors != undefined && result.errors.current_password != undefined ?
                                    <span className="text-danger">{result.errors.current_password}</span>
                                    :<span>This is the password you currently use to log in</span>
                                }
                            </div>

                            <div className="form-group">
                                <label><strong>New Password:</strong></label>
                                <input className="form-control" type="password" value={data.new_password} onChange={(e) => setData({...data, new_password: e.target.value})} required />
                                {
                                    result.errors != undefined && result.errors.new_password != undefined ?
                                    <span className="text-danger">{result.errors.new_password}</span>
                                    :<span>This is the new password you wish to start using</span>
                                }
                            </div>

                            <div className="form-group">
                                <label><strong>Confirm Password:</strong></label>
                                <input className="form-control" type="password" value={data.confirm_password} onChange={(e) => setData({...data, confirm_password: e.target.value})} required />
                                {
                                    result.errors != undefined && result.errors.confirm_password != undefined ?
                                    <span className="text-danger">{result.errors.confirm_password}</span>
                                    :
                                    data.new_password.length && data.new_password != data.confirm_password ?
                                    <span className="text-danger">Passwords do not match!</span>
                                    :<span>Confirm your new password</span>
                                }
                            </div>

                            <button className="btn btn-default btn-block shadow-none">Update Password</button>
                        </form>

                    </div>

                </div>
                {/* END FORM */}
            </div>
        );

}
