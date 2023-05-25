import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../../Shared/Helpers/Misc";
import { post } from "../../../../../Shared/Helpers/Request";
import { WriterApi } from "../../../../Config/WriterApi";
import FileHandler from "../../../../../Shared/Components/FileHandler";
import TextEditor from "../../../../../Shared/Components/TextEditor";

export default function AddSubmission({ order, setOrder = null }){

    const [result, setResult] = useState({
        errors: {}
    })

    const { type } = useParams()

    const [posting, setPosting] = useState(false)
    const [data, setData] = useState({
        answer: '',
        is_final: type == 'final'
    })
    const [attachedFiles, setAttachedFiles] = useState([])
    const [plagReport, setPlagReport] = useState([])

    function onSubmit(event){
        event.preventDefault()

        if(data.is_final && !plagReport.length){
            showError('Please upload a plagiarism report')
            setResult({...result, errors: {plag_report: 'Plagiarism report is required'}})
            return;
        }

        setResult({...result, errors: {}})

        confirmAction(
            {
                title: data.is_final ? 'Complete Order' : 'Submit Answer',
                message: data.is_final ?
                    'This will submit the answer you provided and mark this order as complete' :
                    'This will submit the answer you provided'            },
            handleSubmit
        )
    }

    function handleSubmit(){
        setPosting(true)

        let formData = new FormData();

        // Add data
        for(const key in data){
            formData.append(key, data[key])
        }

        // Add attachments
        for(let i=0; i < attachedFiles.length; i++){
            formData.append('attachments[' + i + ']', attachedFiles[i]);
        }

        if(plagReport.length){
            formData.append('plag_report', plagReport[i]);
        }

        post(generateUrl(WriterApi.ADD_SUBMISSION, {order_id: order.id}), formData)
            .then(result => {
                setResult(result)
                setPosting(false)

                if(result.success){
                    showSuccess(result.status)

                    // Reset data
                    setData({answer: '', is_final: false})
                    setAttachedFiles([])
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
                        <h2 className="heading-title mb-0 font-weight-700">
                            {
                                order.status == 'Settled' ? 'Add Submission' :
                                    (
                                        data.is_final ? 'Final Submission' : 'Draft Submission'
                                    )
                            }
                        </h2>
                    </div>

                    <form onSubmit={onSubmit} autoComplete="off">

                        <div className="card-body">

                            <div className="row">

                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label><strong>Info</strong></label>
                                        <TextEditor
                                            text={data.answer}
                                            onChange={(text) => {
                                                setData({...data, answer: text})
                                            }}
                                        />
                                        {
                                            result.errors != undefined && result.errors.text != undefined ?
                                            <span className="text-danger">{result.errors.text}</span>
                                            :<span>You can add any textual information that is part of the answer here</span>
                                        }
                                    </div>
                                </div>

                                {
                                data.is_final &&
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label><strong>Plagiarism Report</strong></label>
                                        <FileHandler
                                            previousFiles={plagReport}
                                            onChange={setPlagReport}
                                            multiple={false}
                                            size='mini'
                                            />

                                        {
                                            result.errors != undefined && result.errors.plag_report != undefined ?
                                            <span className="text-danger">{result.errors.plag_repport}</span>
                                            :<span>Click the input to select the order's plagiarism report</span>
                                        }
                                    </div>
                                </div>
                                }

                                <div className="col-md-12">
                                    <div className="form-group mb-0">
                                        <label><strong>Attachments</strong></label>

                                        <FileHandler previousFiles={attachedFiles} onChange={setAttachedFiles} />

                                        {
                                            result.errors != undefined && result.errors.attachments != undefined ?
                                            <span className="text-danger">{result.errors.attachments}</span>
                                            :<span>Attach any necessary files here, i.e solutions to the assignment, outlines etc. We recommend you zip the files and send as one attachment</span>
                                        }
                                    </div>
                                </div>

                            </div>

                        </div>


                        <div className="card-body border-top" style={{ background: '#00800005' }}>
                            <div className="row">
                                {
                                    order.status == 'Active' && data.is_final ?

                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <h4><strong>Complete Order</strong></h4>

                                            <p>
                                                This is the final answer, the order marked as complete. If you do not wish so, send a draft submission instead
                                            </p>

                                            {/* <div className="custom-control custom-checkbox">useParams
                                                <input type="checkbox" id="allocate" className="custom-control-input" checked={data.is_final} onChange={(e) => setData({...data, is_final: !data.is_final})} />
                                                <label htmlFor="allocate" className="custom-control-label">
                                                    <span>Complete order now</span>
                                                </label>
                                            </div> */}
                                        </div>
                                    </div>
                                    :<></>
                                }

                                {
                                    order.status == 'Active' && !data.is_final ?

                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <h4><strong>Draft Submissio</strong></h4>

                                            <p>
                                                This is a draft submission. The order will still remain active the until you send a final submission
                                            </p>
                                        </div>
                                    </div>
                                    :<></>
                                }

                            </div>

                            <button className="btn btn-default btn-block shadow-none">Save Submission</button>
                        </div>

                    </form>

                </div>
                {/* END FORM */}
            </div>
        );

}
