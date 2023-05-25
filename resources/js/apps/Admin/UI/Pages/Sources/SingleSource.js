import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Loader from "../../../../Shared/Components/Loader"
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../Shared/Helpers/Misc"
import { post } from "../../../../Shared/Helpers/Request"
import { useGetItem } from "../../../../Shared/Hooks/Request"
import { AdminApi } from "../../../Config/AdminApi"
import { AdminContext } from "../../../Context/AdminContext"
import { useSourceTypes } from "../../../Hooks/Sources"

export default function SingleSource(){
    const [loading, setLoading] = useState(true)
    const [source, setSource] = useState(null)
    const [data, setData] = useState(null)

    const {adminData, setAdminData} = useContext(AdminContext)
    useEffect(() => {
        setAdminData({
            ...adminData,
            pageTitle: 'Update Source' + (source ? (': ' + source.name) : ''),
            headerName: 'Update Source' + (source ? (': ' + source.name) : ''),
            headerIcon: 'fas fa-tag',
        })
    }, [source])

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const { source_id } = useParams()

    const sourceTypes = useSourceTypes()

    useGetItem(
        generateUrl(AdminApi.GET_SOURCE, {source_id: source_id}),
        (source) => {
            setSource({ ...source })
            setData({ ...source })
            setLoading(false)
        }
    )

    function onSubmit(event){
        event.preventDefault()

        confirmAction(
            {
                title: 'Update Source',
                message: 'Please confirm update of the order source details'
            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        post(generateUrl(AdminApi.UPDATE_SOURCE, {source_id: source_id}), data)
            .then(result => {
                setResult(result)
                setPosting(false)

                if(result.success){
                    showSuccess(result.status)
                    setSource({ ...data })
                    setData({ ...data })
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
        source == null ?
        <div>
            Source not found, or an error occurred
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
                    <h2 className="heading-title mb-0 font-weight-700">Update Source Details</h2>
                </div>

                <div className="card-body">

                    <form onSubmit={onSubmit} autoComplete="off">
                        <div className="form-group">
                            <label>Type</label>
                            <select className="form-control" value={data.type} onChange={(e) => setData({...data, type: e.target.value})} required>
                                <option value="">Select a value</option>
                                {
                                    sourceTypes.map(type =>
                                        <option value={type} key={type}>{type}</option>
                                    )
                                }
                            </select>
                            {
                                result.errors != undefined && result.errors.type != undefined ?
                                <span className="text-danger">{result.errors.type}</span>
                                :<span></span>
                            }
                        </div>

                        <div className="form-group">
                            <label>Name</label>
                            <input className="form-control" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} placeholder="e.g platform name" required />
                            {
                                result.errors != undefined && result.errors.name != undefined ?
                                <span className="text-danger">{result.errors.name}</span>
                                :<span></span>
                            }
                        </div>

                        <button className="btn btn-default btn-block shadow-none">Save Source</button>
                    </form>

                </div>

            </div>
            {/* END ITEM */}
        </div>
    );
}
