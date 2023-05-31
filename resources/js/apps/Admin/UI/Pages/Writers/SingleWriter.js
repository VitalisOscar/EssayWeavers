import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Loader from "../../../../Shared/Components/Loader"
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../Shared/Helpers/Misc"
import { post } from "../../../../Shared/Helpers/Request"
import { useGetItem } from "../../../../Shared/Hooks/Request"
import { AdminApi } from "../../../Config/AdminApi"
import { AdminContext } from "../../../Context/AdminContext"

export default function SingleWriter(){
    const [loading, setLoading] = useState(true)
    const [writer, setWriter] = useState(null)
    const [data, setData] = useState(null)

    const {adminData, setAdminData} = useContext(AdminContext)
    useEffect(() => {
        setAdminData({
            ...adminData,
            pageTitle: 'Update Writer' + (writer ? (': ' + writer.name) : ''),
            headerName: 'Update Writer' + (writer ? (': ' + writer.name) : ''),
            headerIcon: 'fa fa-user',
        })
    }, [writer])

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const { writer_id } = useParams()

    useGetItem(
        generateUrl(AdminApi.GET_WRITER, {writer_id: writer_id}),
        (writer) => {
            setWriter({ ...writer, password: '' })
            setData({ ...writer, password: '' })
            setLoading(false)
        }
    )

    function onSubmit(event){
        event.preventDefault()

        confirmAction(
            {
                title: 'Update Writer',
                message: 'Please confirm update of the writer account details'
            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        post(generateUrl(AdminApi.UPDATE_WRITER, {writer_id: writer_id}), data)
            .then(result => {
                setResult(result)
                setPosting(false)

                if(result.success){
                    showSuccess(result.status)
                    setWriter({ ...data, password: '' })
                    setData({ ...data, password: '' })
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

    return loading ?
    (
        <Loader />
    )
    :
    (
        writer == null ?
        <div>
            Writer not found, or an error occurred
        </div>
        :
        <div className="col-md-8 col-lg-6 col-xl-5 mx-auto">
            {/* ITEM INFO */}
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
                    <h2 className="heading-title mb-0 font-weight-700">Update Writer Details</h2>
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
                            <input className="form-control" type="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} placeholder="Password" autoComplete="off" />
                            {
                                result.errors != undefined && result.errors.password != undefined ?
                                <span className="text-danger">{result.errors.password}</span>
                                :<span>Leave this blank unless you wish to reset the password</span>
                            }
                        </div>

                        <div className="form-group">
                            <label>Default CPP</label>
                            <input className="form-control" type="number" value={data.cpp} onChange={(e) => setData({...data, cpp: e.target.value})} placeholder="e.g 350" autoComplete="off" />
                            {
                                result.errors != undefined && result.errors.cpp != undefined ?
                                    <span className="text-danger">{result.errors.cpp}</span>
                                    :<span></span>
                            }
                        </div>

                        <div className="form-group">
                            <label>Account Status</label>
                            <select className="form-control" value={data.status} onChange={(e) => setData({...data, status: e.target.value})} required>
                                <option value="">Select a value</option>
                                <option value="Active">Active</option>
                                <option value="Disabled">Disabled</option>
                            </select>
                            {
                                result.errors != undefined && result.errors.status != undefined ?
                                <span className="text-danger">{result.errors.status}</span>
                                :<span></span>
                            }
                        </div>

                        <button className="btn btn-default btn-block shadow-none">Save Details</button>
                    </form>

                </div>

            </div>
            {/* END ITEM */}
        </div>
    );
}
