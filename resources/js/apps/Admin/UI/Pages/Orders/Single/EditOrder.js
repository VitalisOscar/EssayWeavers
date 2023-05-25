import { useContext, useState } from "react";
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../../Shared/Helpers/Misc";
import { post } from "../../../../../Shared/Helpers/Request";
import { AdminApi } from "../../../../Config/AdminApi";
import Attachment from "../../../../../Shared/Components/Attachment";
import FileHandler from "../../../../../Shared/Components/FileHandler";
import TextEditor from "../../../../../Shared/Components/TextEditor";
import { OrderContext } from "../../../../Context/OrderContext";

export default function EditOrder(){
    const {order, setOrder} = useContext(OrderContext)

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const [data, setData] = useState({ ...order })
    const [attachedFiles, setAttachedFiles] = useState([])
    const [deleteAttachments, setDeleteAttachments] = useState([])

    function onSubmit(event){
        event.preventDefault()

        confirmAction(
            {
                title: 'Update Order',
                message: 'Confirm that you wish to update the order requirements'
            },
            handleSubmit
        )
    }

    function attachmentDeleted(attachment_id, deleted){
        if(deleted){
            deleteAttachments.push(attachment_id)
            setDeleteAttachments([...deleteAttachments])
        }else{
            setDeleteAttachments(deleteAttachments.filter(a => a !== attachment_id))
        }
        
        console.log(deleteAttachments)
    }

    function handleSubmit(){
        setPosting(true)

        let formData = new FormData();
        formData.append('requirements', data.requirements)

        // Add attachments
        for(let i=0; i < attachedFiles.length; i++){
            formData.append('attachments[' + i + ']', attachedFiles[i]);
        }

        // Add attachments to delete
        for(let i=0; i < deleteAttachments.length; i++){
            formData.append('delete_attachments[' + i + ']', deleteAttachments[i]);
        }

        post(generateUrl(AdminApi.EDIT_ORDER, {order_id: order.id}), formData)
            .then(result => {
                setResult(result)
                setPosting(false)

                if(result.success){
                    showSuccess(result.status)

                    // Reset data
                    setAttachedFiles([])
                    setDeleteAttachments([])
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
            <div className="col-lg-9 col-lg-6col-xl-5 mx-auto">
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
                        <h2 className="heading-title mb-0 font-weight-700">Edit Order</h2>
                    </div>

                    <form onSubmit={onSubmit} autoComplete="off">

                        <div className="card-body">

                            <div className="row">

                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label><strong>Requirements</strong></label>
                                        <TextEditor
                                            text={data.requirements}
                                            onChange={(text) => {
                                                setData({...data, requirements: text})
                                            }}
                                        />
                                        {
                                            result.errors != undefined && result.errors.requirements != undefined ?
                                            <span className="text-danger">{result.errors.requirements}</span>
                                            :<span>You can add any requirements or instructions to the writer here</span>
                                        }
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label><strong>Add Attachments</strong></label>

                                        <FileHandler onChange={setAttachedFiles} />

                                        {
                                            result.errors != undefined && result.errors.attachments != undefined ?
                                            <span className="text-danger">{result.errors.attachments}</span>
                                            :<span></span>
                                        }
                                    </div>
                                </div>

                                {
                                data.attachments && data.attachments.length > 0 &&
                                <div className="col-md-12">
                                    <div className="form-group mb-0">
                                        <label><strong>Previous Attachments</strong></label>

                                        <div className="attachments">
                                            <div className="row">
                                            {
                                                data.attachments.map(attachment => <Attachment deletable={true} onDeleteChange={attachmentDeleted} key={attachment.id} data={attachment} />)
                                            }
                                            </div>
                                        </div>

                                        {
                                            result.errors != undefined && result.errors.attachments != undefined ?
                                            <span className="text-danger">{result.errors.attachments}</span>
                                            :<span></span>
                                        }
                                    </div>
                                </div>
                                }

                            </div>

                            <button className="btn btn-default btn-block shadow-none">Update Order</button>

                        </div>

                    </form>

                </div>
                {/* END FORM */}
            </div>
        );

}
