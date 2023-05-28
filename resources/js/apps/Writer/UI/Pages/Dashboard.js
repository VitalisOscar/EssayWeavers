import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get } from "../../../Shared/Helpers/Request";
import { generateUrl, showError } from "../../../Shared/Helpers/Misc";
import { WriterApi } from "../../Config/WriterApi";
import { WriterRoutes } from "../../Config/WriterRoutes";
import { WriterContext } from "../../Context/WriterContext";

export default function Dashboard(){
    const {writerData, setWriterData} = useContext(WriterContext)
    const [data, setData] = useState({})

    useEffect(() => {
        setWriterData({
            ...writerData,
            pageTitle: 'Writer Dashboard',
            headerName: 'Writer Dashboard',
            headerIcon: 'fa fa-chart-o',
        })

        refreshData()

        //setInterval(refreshData, 60000)
    }, [])

    function refreshData(){
        get(WriterApi.DASHBOARD_DATA)
            .then(dashboardData => {
                setData(dashboardData)
            })
            .catch(error => {
                console.log(error)
                // showError('Failed to load writer summary')
            })
    }

    return (
        <div>

            <div className="row mb-4">
                <div className="col-sm-4 col-lg-3">
                    <div className="card content-card px-3 py-3">

                        <i className="fa fa-users bg-warning icon colored-icon square mb-3"></i>

                        <h5 className="heading text-muted">Total Earnings</h5>

                        <h4 className="font-weight-700 display-4 mb-0">{data.accounts && data.accounts.cleared_formatted ? data.accounts.cleared_formatted : ('KES ' + 0)}</h4>

                    </div>
                </div>

                <div className="col-sm-4 col-lg-3">
                    <div className="card content-card px-3 py-3">

                        <i className="fa fa-book bg-indigo icon colored-icon square mb-3"></i>

                        <h5 className="heading text-muted">Paid Out</h5>

                        <h4 className="font-weight-700 display-4 mb-0">{data.accounts && data.accounts.paid_out_formatted ? data.accounts.paid_out_formatted : ('KES ' + 0)}</h4>

                    </div>
                </div>

                <div className="col-sm-4 col-lg-3">
                    <div className="card content-card px-3 py-3">

                        <i className="fa fa-check-square-o bg-default icon colored-icon square mb-3"></i>

                        <h5 className="heading text-muted">Pending Balance</h5>

                        <h4 className="font-weight-700 display-4 mb-0">{data.accounts && data.accounts.pending_formatted ? data.accounts.pending_formatted : ('KES ' + 0)}</h4>

                    </div>
                </div>

                <div className="col-sm-4 col-lg-3">
                    <div className="card content-card px-3 py-3">

                        <i className="fa fa-coins bg-success icon colored-icon square mb-3"></i>

                        <h5 className="heading text-muted">Available Balance</h5>

                        <h4 className="font-weight-700 display-4 mb-0">{data.accounts && data.accounts.available_formatted ? data.accounts.available_formatted : ('KES ' + 0)}</h4>

                    </div>
                </div>
            </div>

            <div className="card content-card">

                <div className="card-header rounded-top d-flex align-items-center bg-white">
                    <h2 className="heading-title mb-0 font-weight-700">New Orders</h2>
                </div>

                <div>
                    <table className="table table-striped" style={{maxWidth: '100%'}}>

                        <tbody>
                            <tr className="sticky-top bg-default text-white">
                                <td><strong>#</strong></td>
                                <td><strong>Title</strong></td>
                                <td><strong>Price</strong></td>
                                <td><strong>Deadline</strong></td>
                                <td></td>
                            </tr>

                            {/* NO RESULT */}
                            {
                                ((data.new_orders ?? []).length == 0) ?

                                <tr>
                                    <td colSpan="9">
                                        No orders at the moment
                                    </td>
                                </tr>
                                // END NO RESULTS
                                :
                                // START RESULTS

                                (data.new_orders ?? []).map((item, index) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                { index + 1 }
                                            </td>

                                            <td>
                                                {item.title}
                                            </td>

                                            <td>
                                                {item.price_formatted}
                                            </td>

                                            <td>
                                                {item.deadline_formatted}
                                            </td>

                                            <td>
                                                <Link to={generateUrl(WriterRoutes.SINGLE_ORDER, {order_id: item.id})}>
                                                    View
                                                    <i className="ml-2 fa fa-share"></i>
                                                </Link>
                                            </td>

                                        </tr>

                                    )
                                })
                            }
                            {/* END RESULTS */}

                        </tbody>

                    </table>
                </div>


            </div>

        </div>
    );

}
