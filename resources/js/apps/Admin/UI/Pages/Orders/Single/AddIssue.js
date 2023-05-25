import { useContext, useState } from "react";
import TextEditor from "../../../../../Shared/Components/TextEditor";
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../../Shared/Helpers/Misc";
import { post } from "../../../../../Shared/Helpers/Request";
import { AdminApi } from "../../../../Config/AdminApi";
import { OrderContext } from "../../../../Context/OrderContext";

export default function AddIssue(){
    const {order, setOrder} = useContext(OrderContext)

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const [data, setData] = useState({
        title: '',
        description: '',
    })

    function onSubmit(event){
        event.preventDefault()

        confirmAction(
            {
                title: 'Add Issues',
                message: "This will add the issues, and the writer will have the order under 'Needs Review' status"
            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        post(generateUrl(AdminApi.ADD_ORDER_ISSUE, {order_id: order.id}), data)
            .then(result => {
                setResult(result)
                setPosting(false)

                if(result.success){
                    showSuccess(result.status)
                    setData({
                        title: '',
                        description: '',
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

                    <div className="modal-header rounded-top d-flex align-items-center" style={{background: '#f6f9fc'}}>
                        <h2 className="heading-title mb-0 font-weight-700">Add an Issue</h2>
                        <span className="close" data-dismiss="modal">
                            <i className="fa fa-times"></i>
                        </span>
                    </div>

                    <div className="modal-body">

                        <form onSubmit={onSubmit} autoComplete="off">
                            <div className="form-group">
                                <label><strong>Title</strong></label>
                                <input className="form-control" value={data.title} onChange={(e) => setData({...data, title: e.target.value})} placeholder="e.g Incorrect formatting" required />
                                {
                                    result.errors != undefined && result.errors.title != undefined ?
                                    <span className="text-danger">{result.errors.title}</span>
                                    :<span></span>
                                }
                            </div>

                            <div className="form-group">
                                <label><strong>Description</strong></label>
                                <TextEditor
                                    text={data.description}
                                    onChange={ (text) => {
                                        setData({...data, description: text})
                                    } }
                                />
                                {
                                    result.errors != undefined && result.errors.description != undefined ?
                                    <span className="text-danger">{result.errors.description}</span>
                                    :<span>You can add any description of the issue here</span>
                                }
                            </div>

                            <button className="btn btn-default btn-block shadow-none">Save Issue</button>
                        </form>

                    </div>

                </div>

            </div>
        );

}
