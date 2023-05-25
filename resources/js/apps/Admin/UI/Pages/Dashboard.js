import { useContext, useEffect, useState } from "react";
import { get } from "../../../Shared/Helpers/Request";
import { AdminApi } from "../../Config/AdminApi";
import { AdminContext } from "../../Context/AdminContext";

export default function Dashboard(){
    const [data, setData] = useState({})
    const {adminData, setAdminData} = useContext(AdminContext)
    useEffect(() => {
        setAdminData({
            ...adminData,
            pageTitle: 'Admin Dashboard',
            headerName: 'Admin Dashboard',
            headerIcon: 'fa fa-chart',
            hasStats: true
        })

        refreshData()

        setInterval(refreshData, 60000)
    }, [])

    function refreshData(){
        get(AdminApi.DASHBOARD_DATA)
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

            <div className="row">
                <div className="col-sm-4 col-lg-3">
                    <div className="card content-card px-3 py-3">

                        <i className="fa fa-users bg-warning icon colored-icon square mb-3"></i>

                        <h5 className="heading text-muted">My Writers</h5>

                        <h4 className="font-weight-700 display-4 mb-0">{data.writers ? data.writers : 0}</h4>

                    </div>
                </div>

                <div className="col-sm-4 col-lg-3">
                    <div className="card content-card px-3 py-3">

                        <i className="fa fa-book bg-indigo icon colored-icon square mb-3"></i>

                        <h5 className="heading text-muted">Total Orders</h5>

                        <h4 className="font-weight-700 display-4 mb-0">{data.total_orders ? data.total_orders : 0}</h4>

                    </div>
                </div>

                <div className="col-sm-4 col-lg-3">
                    <div className="card content-card px-3 py-3">

                        <i className="fa fa-check-square-o bg-default icon colored-icon square mb-3"></i>

                        <h5 className="heading text-muted">Settled Orders</h5>

                        <h4 className="font-weight-700 display-4 mb-0">{data.settled_orders ? data.settled_orders : 0}</h4>

                    </div>
                </div>

                <div className="col-sm-4 col-lg-3">
                    <div className="card content-card px-3 py-3">

                        <i className="fa fa-coins bg-success icon colored-icon square mb-3"></i>

                        <h5 className="heading text-muted">Net Profit</h5>

                        <h4 className="font-weight-700 display-4 mb-0">{data.net_profit ? data.net_profit : ('KES ' + 0)}</h4>

                    </div>
                </div>
            </div>

        </div>
    );

}
