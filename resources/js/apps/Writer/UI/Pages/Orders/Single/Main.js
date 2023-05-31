import { useState } from "react";
import { Link } from "react-router-dom";
import Attachment from "../../../../../Shared/Components/Attachment";
import OrderSubmissions from "../../../../../Shared/Components/OrderSubmissions";
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../../Shared/Helpers/Misc";
import { post } from "../../../../../Shared/Helpers/Request";
import { WriterApi } from "../../../../Config/WriterApi";

export default function Main({ order = null, setOrder = null }){
    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)

    function declineAllocation(){
        confirmAction({
            title: 'Decline order allocation',
            message: 'Are you sure you do not want to take this order? You will not be able to see it in your order list'
        }, () => {

            setPosting(true)

            post(generateUrl(WriterApi.DECLINE_ALLOCATION, {order_id: order.id}))
                .then(result => {
                    setResult(result)
                    setPosting(false)

                    if(result.success){
                        showSuccess(result.status)
                        setOrder({ ...result.data })
                    }else{
                        showError(result.status)
                    }
                })
                .catch(error => {
                    console.log(error)
                    setPosting(false)

                    showError('An exception occurred')
                })

        })
    }

    function acceptAllocation(){
        confirmAction({
            title: 'Accept order allocation',
            message: 'This order will be marked as active and you will be responsible for working on it to completion'
        }, () => {

            setPosting(true)

            post(generateUrl(WriterApi.ACCEPT_ALLOCATION, {order_id: order.id}))
                .then(result => {
                    setResult(result)
                    setPosting(false)

                    if(result.success){
                        showSuccess(result.status)
                        if(setOrder) setOrder({ ...result.data })
                    }else{
                        showError(result.status)
                    }
                })
                .catch(error => {
                    console.log(error)
                    setPosting(false)

                    showError('An exception occurred')
                })

        })
    }

    return (
            <div className="col-lg-9 col-lg-6 col-xl-12 mx-auto">

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

                    <div className="card-header bg-white d-flex align-items-center">
                        <div>
                            <h2 className="heading-title font-weight-700 mb-2">
                                {order.title}
                            </h2>

                            <h4 className={"mb-0"}>Order ID: {order.id}</h4>
                        </div>
                    </div>

                    {
                        order.status != 'Allocated' ?
                        <div className="card-body">
                            <div className="row">

                                <div className="col-md-12 col-xl-4">
                                    <div className="mb-4 order-spec">
                                        <h4 className="heading font-weight-700">
                                            <i className="fa fa-info mr-2 icon colored-icon icon-sm bg-default"></i>
                                            Order Status
                                        </h4>
                                        <div className="spec">{order.status}</div>
                                    </div>
                                </div>

                                <div className="col-md-12 col-xl-4">

                                    <div className="mb-4 order-spec">
                                        <h4 className="heading font-weight-700">
                                            <i className="fa fa-coins mr-2 icon colored-icon icon-sm bg-indigo"></i>
                                            Allocated Payment
                                        </h4>
                                        <div className="spec">{order.price_formatted}</div>
                                    </div>

                                </div>

                                <div className="col-md-12 col-xl-4">
                                    <div className="mb-4 order-spec">
                                        <h4 className="heading font-weight-700">
                                            <i className="fa fa-calendar mr-2 icon colored-icon icon-sm bg-danger"></i>
                                            Your Deadline
                                        </h4>
                                        <div className="spec">{order.deadline_formatted}</div>
                                    </div>
                                </div>

                            </div>

                        </div>
                        :
                        <></>
                    }

                    <div className="card-body border-top">

                        <h2 className="heading font-weight-700 mb-4 text-primary">Order Requirements</h2>

                        {order.pages &&
                            <div>
                                <strong>Pages Required: </strong>{order.pages}
                            </div>
                        }
                        <div className="mb-4" dangerouslySetInnerHTML={{__html: order.requirements}}></div>

                        <div className="attachments">
                            <div className="row">
                            {
                                order.attachments.map(attachment => <Attachment key={attachment.id} data={attachment} />)
                            }
                            </div>
                        </div>

                    </div>

                    {
                        order.status == 'Allocated' ?
                        <div className="card-footer border-top d-flex align-items-center">
                            <div>
                                <h5 className="heading-title mb-0">
                                    Your Payment: <strong className="text-success">{order.price_formatted}</strong>
                                </h5>

                                <h5 className="heading">
                                    Deadline: <strong className="text-">{order.deadline_formatted}</strong>
                                </h5>
                            </div>

                            <div className="ml-auto">
                                <button className="btn btn-text text-danger shadow-none" onClick={declineAllocation}>Decline Order</button>
                                <button className="btn btn-default shadow-none" onClick={acceptAllocation}>Accept Order</button>
                            </div>

                        </div>
                        :<></>
                    }

                    {
                        order.status == 'Active' || order.status == 'Completed' ||
                            (order.submissions && order.submissions.length) ?
                        <div className="card-body border-top">

                            <h2 className="heading font-weight-700 mb-4 text-primary">Submissions</h2>

                            {
                                order.submissions && order.submissions.length == 0 ?
                                <div className="mb-3">
                                    You have not submitted anything yet
                                </div>
                                :
                                <OrderSubmissions order={order} />
                            }

                            {
                                order.status == 'Active' ?
                                <>
                                    <Link to="submit-answer/draft" className="btn btn-link text-default border">
                                        <i className="fa fa-add mr-2"></i>
                                        Draft Submission
                                    </Link>

                                    <Link to="submit-answer/final" className="btn btn-link text-default border">
                                        <i className="fa fa-add mr-2"></i>
                                        Final Submission
                                    </Link>
                                </>
                                :
                                <Link to="submit-answer/draft" className="btn btn-link text-default border">
                                    <i className="fa fa-add mr-2"></i>
                                    Add Submission
                                </Link>
                            }


                        </div>
                        :<></>
                    }

                </div>

            </div>
        );

}
