import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Loader from "../../../../Shared/Components/Loader"
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../Shared/Helpers/Misc"
import { post } from "../../../../Shared/Helpers/Request"
import { useGetItem } from "../../../../Shared/Hooks/Request"
import { AdminApi } from "../../../Config/AdminApi"
import { AdminContext } from "../../../Context/AdminContext"

export default function SingleBidder(){
    const [loading, setLoading] = useState(true)
    const [bidder, setBidder] = useState(null)
    const [data, setData] = useState(null)

    const {adminData, setAdminData} = useContext(AdminContext)
    useEffect(() => {
        setAdminData({
            ...adminData,
            pageTitle: 'Update Bidder' + (bidder ? (': ' + bidder.name) : ''),
            headerName: 'Update Bidder' + (bidder ? (': ' + bidder.name) : ''),
            headerIcon: 'fas fa-user',
        })
    }, [bidder])

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const { bidder_id } = useParams()

    useGetItem(
        generateUrl(AdminApi.GET_BIDDER, {bidder_id: bidder_id}),
        (bidder) => {
            setBidder({ ...bidder })
            setData({ ...bidder })
            setLoading(false)
        }
    )

    function onSubmit(event){
        event.preventDefault()

        confirmAction(
            {
                title: 'Update Bidder',
                message: 'Please confirm update of the bidder details'
            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        post(generateUrl(AdminApi.UPDATE_BIDDER, {bidder_id: bidder_id}), data)
            .then(result => {
                setResult(result)
                setPosting(false)

                if(result.success){
                    showSuccess(result.status)
                    setBidder({ ...data })
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
        bidder == null ?
        <div>
            Bidder not found, or an error occurred
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
                    <h2 className="heading-title mb-0 font-weight-700">Update Bidder Details</h2>
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
            {/* END ITEM */}
        </div>
    );
}
