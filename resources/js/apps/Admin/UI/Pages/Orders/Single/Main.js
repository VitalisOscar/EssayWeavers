import { useOrderMetricsProfit, useOrderMetricsTimeToDeadline } from "../../../../Hooks/Order";
import { Link } from "react-router-dom";
import OrderSubmissions from "../../../../../Shared/Components/OrderSubmissions";
import { AdminApi } from "../../../../Config/AdminApi";
import { useContext, useState } from "react";
import Attachment from "../../../../../Shared/Components/Attachment";
import { confirmAction, generateUrl, showError, showSuccess } from "../../../../../Shared/Helpers/Misc";
import { post } from "../../../../../Shared/Helpers/Request";
import { AdminContext } from "../../../../Context/AdminContext";
import CancelOrder from "./CancelOrder";
import AddIssue from "./AddIssue";
import AddPayment from "./AddPayment";
import { OrderContext } from "../../../../Context/OrderContext";
import EditOrderPrice from "./EditOrderPrice";
import EditWriterDeadline from "./EditWriterDeadline";

export default function Main(){
    const {order, setOrder} = useContext(OrderContext)

    const [result, setResult] = useState({
        errors: {}
    })
    const [posting, setPosting] = useState(false)
    const {adminData, setAdminData} = useContext(AdminContext)

    const profit = order.current_writer ?
        useOrderMetricsProfit(order.price_raw, (order.writer_price_raw + order.bidder_commission)) : 0
    const reviewTime = order.current_writer ?
        useOrderMetricsTimeToDeadline(order.deadline_raw, order.writer_deadline_raw) : '0'

    let showSubmissions = order.status == 'Active' || order.status == 'Completed' ||
        (order.submissions && order.submissions.length);
    let showIssues = order.status == 'Completed' || (order.issues && order.issues.length);
    let showLogs = (order.logs && order.logs.length);

    function settleOrder(){
        confirmAction(
            {
                title: 'Settle Order',
                message: 'This will mark the order as settled and update the related earnings for the writer'
            },
            () => {
                setPosting(true)

                post(generateUrl(AdminApi.SETTLE_ORDER, {order_id: order.id}))
                    .then(result => {
                        setResult(result)
                        setPosting(false)

                        if(result.success){
                            showSuccess(result.status)
                            if(setOrder) setOrder(result.data)
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
        )
    }

    function deleteAllocation(){
        confirmAction(
            {
                title: 'Delete Allocation',
                message: 'This will delete the current allocation and mark the order as new'
            },
            () => {
                setPosting(true)

                post(generateUrl(AdminApi.DELETE_ALLOCATION, {order_id: order.id}))
                    .then(result => {
                        setResult(result)
                        setPosting(false)

                        if(result.success){
                            showSuccess(result.status)
                            if(setOrder) setOrder(result.data)
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
        )
    }

    function cancelOrder(){
        setAdminData({...adminData, modalOpen: true, modalContent: <CancelOrder order={order} setOrder={setOrder} />})
    }

    function addIssue(){
        setAdminData({...adminData, modalOpen: true, modalContent: <AddIssue order={order} setOrder={setOrder} />})
    }

    function addPayment(){
        setAdminData({...adminData, modalOpen: true, modalContent: <AddPayment order={order} setOrder={setOrder} />})
    }

    function editPrice(){
        setAdminData({...adminData, modalOpen: true, modalContent: <EditOrderPrice order={order} setOrder={setOrder} />})
    }

    function editWriterDeadline(){
        setAdminData({...adminData, modalOpen: true, modalContent: <EditWriterDeadline order={order} setOrder={setOrder} />})
    }

    return (
            <div className="col-lg-9 col-lg-6 col-xl-12 mx-auto">
                {/* FORM */}
                <div className="card content-card has-loader">

                    <div className="card-header bg-white d-flex align-items-center">
                        <div>
                            <h2 className="heading-title font-weight-700 mb-2">
                                {order.title}
                            </h2>

                            <h4 className={"mb-0"}>Order ID: {order.id}</h4>
                        </div>

                        <div className="ml-auto dropdown">
                            {
                                order.status != 'Cancelled' ?
                                <button data-toggle="dropdown" className="btn btn-outline-default mr-0 shadow-none dropdown-toggle">
                                    Actions
                                </button>
                                :<></>
                            }

                            <ul className="dropdown-menu">
                                { order.status == 'New' ?
                                <>
                                    <li className="dropdown-item">
                                        <Link to="allocate" className="dropdown-link">
                                            Allocate to writer
                                        </Link>
                                    </li>

                                    <li className="dropdown-item">
                                        <Link to="edit" className="dropdown-link">
                                            Edit Requiements
                                        </Link>
                                    </li>

                                    <li className="dropdown-item">
                                        <a onClick={editPrice} className="dropdown-link">
                                            Edit Order Price
                                        </a>
                                    </li>
                                </>
                                :<></>
                                }

                                { order.status == 'Allocated' ?
                                <>
                                    <li className="dropdown-item">
                                        <Link to="allocate" className="dropdown-link">
                                            Update Allocation
                                        </Link>
                                    </li>

                                    <li className="dropdown-item">
                                        <Link to="edit" className="dropdown-link">
                                            Edit Requiements
                                        </Link>
                                    </li>

                                    <li className="dropdown-item">
                                        <a onClick={editPrice} className="dropdown-link">
                                            Edit Order Price
                                        </a>
                                    </li>

                                    <li className="dropdown-item">
                                        <a onClick={deleteAllocation} className="dropdown-link">
                                            Delete Allocation
                                        </a>
                                    </li>
                                </>
                                :<></>
                                }

                                { order.status == 'Active' ?
                                <>
                                    <li className="dropdown-item">
                                        <a onClick={addPayment} className="dropdown-link">
                                            Add Payment
                                        </a>
                                    </li>

                                    <li className="dropdown-item">
                                        <Link to="edit" className="dropdown-link">
                                            Edit Requiements
                                        </Link>
                                    </li>

                                    <li className="dropdown-item">
                                        <a onClick={editPrice} className="dropdown-link">
                                            Edit Order Price
                                        </a>
                                    </li>

                                    <li className="dropdown-item">
                                        <a onClick={editWriterDeadline} className="dropdown-link">
                                            Update Writer Deadline
                                        </a>
                                    </li>

                                    {/* <li className="dropdown-item">
                                        <Link to="allocate" className="dropdown-link">
                                            Assign to other
                                        </Link>
                                    </li> */}

                                    <li className="dropdown-item">
                                        <a onClick={cancelOrder} className="dropdown-link">
                                            Cancel Order
                                        </a>
                                    </li>
                                </>
                                :<></>
                                }

                                { order.status == 'Completed' ?
                                <>
                                    <li className="dropdown-item">
                                        <a onClick={settleOrder} className="dropdown-link">
                                            Settle Order
                                        </a>
                                    </li>

                                    <li className="dropdown-item">
                                        <a onClick={addPayment} className="dropdown-link">
                                            Add Payment
                                        </a>
                                    </li>

                                    <li className="dropdown-item">
                                        <Link to="edit" className="dropdown-link">
                                            Edit Requiements
                                        </Link>
                                    </li>

                                    <li className="dropdown-item">
                                        <a onClick={editPrice} className="dropdown-link">
                                            Edit Order Price
                                        </a>
                                    </li>

                                    <li className="dropdown-item">
                                        <a onClick={editWriterDeadline} className="dropdown-link">
                                            Update Writer Deadline
                                        </a>
                                    </li>

                                    {/* <li className="dropdown-item">
                                        <a onClick={addIssue} className="dropdown-link">
                                            Add Issue
                                        </a>
                                    </li> */}

                                    <li className="dropdown-item">
                                        <a onClick={cancelOrder} className="dropdown-link">
                                            Cancel Order
                                        </a>
                                    </li>
                                </>
                                :<></>
                                }

                                { order.status == 'Settled' ?
                                <>
                                    <li className="dropdown-item">
                                        <a onClick={addPayment} className="dropdown-link">
                                            Add Payment
                                        </a>
                                    </li>

                                    <li className="dropdown-item">
                                        <a onClick={editPrice} className="dropdown-link">
                                            Edit Order Price
                                        </a>
                                    </li>
                                </>
                                :<></>
                                }
                            </ul>
                        </div>
                    </div>

                    <div className="card-body">
                        <div className="row">

                            <div className="col-md-12 col-xl-4">
                                {
                                    order.current_writer ?
                                    <>
                                        <div className="mb-4 order-spec">
                                            <h4 className="heading font-weight-700">
                                                <i className="fa fa-info mr-2 icon colored-icon icon-sm bg-default"></i>
                                                Order Status
                                            </h4>
                                            <div className="spec">{order.status}</div>
                                        </div>

                                        <div className="mb-4 order-spec">
                                            <h4 className="heading font-weight-700">
                                                <i className="fa fa-user mr-2 icon colored-icon icon-sm bg-success"></i>
                                                Current Writer
                                            </h4>
                                            <div className="spec">{order.current_writer.name}</div>
                                        </div>
                                    </> : <></>
                                }

                                {
                                    order.bidder && order.bidder.name &&
                                    <div className="mb-4 order-spec">
                                        <h4 className="heading font-weight-700">
                                            <i className="fa fa-user-o mr-2 icon colored-icon icon-sm bg-dark"></i>
                                            Bidder
                                        </h4>
                                        <div className="spec">{order.bidder.name}</div>
                                    </div>
                                }

                                <div className="mb-4 order-spec">
                                    <h4 className="heading font-weight-700">
                                        <i className="ni ni-world-2 mr-2 icon colored-icon icon-sm bg-dark"></i>
                                        Order Source
                                    </h4>
                                    <div className="spec">{order.source.name}</div>
                                </div>
                            </div>

                            <div className="col-md-12 col-xl-4">

                                <div className="mb-4 order-spec">
                                    <h4 className="heading font-weight-700">
                                        <i className="ni ni-money-coins mr-2 icon colored-icon icon-sm bg-danger"></i>
                                        Order Price
                                    </h4>
                                    <div className="spec">{order.price_formatted}</div>
                                </div>

                                {
                                    order.bidder && order.bidder.name &&
                                    <div className="mb-4 order-spec">
                                        <h4 className="heading font-weight-700">
                                            <i className="fa fa-coins mr-2 icon colored-icon icon-sm bg-dark"></i>
                                            Bidder Commission
                                        </h4>
                                        <div className="spec">{order.bidder_commission_formatted}</div>
                                    </div>
                                }

                                {
                                    order.current_writer ?
                                    <>
                                        <div className="mb-4 order-spec">
                                            <h4 className="heading font-weight-700">
                                                <i className="fa fa-coins mr-2 icon colored-icon icon-sm bg-indigo"></i>
                                                Writer's Payment
                                            </h4>
                                            <div className="spec">{order.writer_price_formatted}</div>
                                        </div>

                                        <div className="mb-3 order-spec">
                                            <h4 className="heading font-weight-700">
                                                <i className="fa fa-money-bill mr-2 icon colored-icon icon-sm bg-warning"></i>
                                                Your Profit
                                            </h4>
                                            <div style={{fontSize: '1.1em'}} className={'spec ' + (profit > 0 ? 'text-success' : (profit < 0 ? 'text-danger' : ''))}>{profit.toLocaleString()}</div>
                                        </div>
                                    </> : <></>
                                }
                            </div>

                            <div className="col-md-12 col-xl-4">
                                <div className="order-spec mb-4">
                                    <h4 className="heading font-weight-700">
                                        <i className="fa fa-calendar-o mr-2 icon colored-icon icon-sm bg-purple"></i>
                                        Main Deadline
                                    </h4>
                                    <div className="spec">{order.deadline_formatted}</div>
                                </div>

                                {
                                    order.current_writer ?
                                    <>
                                        <div className="mb-4 order-spec">
                                            <h4 className="heading font-weight-700">
                                                <i className="fa fa-calendar mr-2 icon colored-icon icon-sm bg-danger"></i>
                                                Writer's Deadline
                                            </h4>
                                            <div className="spec">{order.writer_deadline_formatted}</div>
                                        </div>

                                        <div className="mb-3 order-spec">
                                            <h4 className="heading font-weight-700">
                                                <i className="fa fa-clock-o mr-2 icon colored-icon icon-sm bg-info"></i>
                                                Review Time
                                            </h4>
                                            <div className="spec">
                                                <span className={reviewTime.positive ? 'text-success' : 'text-danger'}>{reviewTime.difference}</span>
                                            </div>
                                        </div>
                                    </> : <></>
                                }
                            </div>

                        </div>

                    </div>

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
                        (showSubmissions || showIssues || showLogs) ?
                        <div className="card-body border-top">

                            {/* <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <a className="nav-link active" href="#submissions">Submissions</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#issues">Issues</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#logs">Logs</a>
                                </li>
                            </ul> */}
                            <h2 className="heading font-weight-700 mb-4 text-primary">Submissions</h2>

                            <div>
                                <div className="tab-panecontaineractive" id="submissions">
                                {
                                    order.submissions && order.submissions.length == 0 ?
                                    <div className="mb-3">
                                        The writer has not submitted anything yet
                                    </div>
                                    :
                                    <OrderSubmissions order={order} />
                                }
                                </div>
                                {/* <div className="tab-pane container fade" id="issues">

                                </div>
                                <div className="tab-pane container fade" id="logs">

                                </div> */}
                            </div>

                        </div>
                        :<></>
                    }

                </div>

            </div>
        );

}
