import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AdminRoutes } from './Config/AdminRoutes';
import { AdminContext, AdminProvider } from './Context/AdminContext';
import { OrderProvider } from './Context/OrderContext';
import Header from './UI/Components/Header';
import Dashboard from './UI/Pages/Dashboard';
import AddOrder from './UI/Pages/Orders/AddOrder';
import ListOrders from './UI/Pages/Orders/ListOrders';
import SingleOrder from './UI/Pages/Orders/Single/SingleOrder';
import Password from './UI/Pages/Password';
import AddPayout from './UI/Pages/Payouts/AddPayout';
import ListPayouts from './UI/Pages/Payouts/ListPayouts';
import AddSource from './UI/Pages/Sources/AddSource';
import ListSources from './UI/Pages/Sources/ListSources';
import SingleSource from './UI/Pages/Sources/SingleSource';
import AddWriter from './UI/Pages/Writers/AddWriter';
import ListWriters from './UI/Pages/Writers/ListWriters';
import SingleWriter from './UI/Pages/Writers/SingleWriter';

function AdminApp() {
    const {adminData} = useContext(AdminContext)

    return (
        <>

            <BrowserRouter basename="admin">
                <Header />

                <div className="main-content" id="panel">

                    {/* MAIN CONTENT */}
                    <div className="p-4 p-md-5 container-fluid" style={{zIndex: "3", position: "relative"}}>

                        {/* <div className="stats px-0">
                        </div> */}

                        <Routes>

                            <Route path={AdminRoutes.DASHBOARD} element={<Dashboard />} />
                            <Route path={AdminRoutes.UPDATE_PASSWORD} element={<Password />} />

                            {/* Orders */}
                            <Route path={AdminRoutes.LIST_ORDERS} element={<ListOrders />} />
                            <Route path={AdminRoutes.ADD_ORDER} element={<AddOrder />} />
                            <Route path={AdminRoutes.SINGLE_ORDER + '/*'} element={<OrderProvider><SingleOrder /></OrderProvider>} />

                            {/* Payouts */}
                            <Route path={AdminRoutes.LIST_PAYOUTS} element={<ListPayouts />} />
                            <Route path={AdminRoutes.ADD_PAYOUT} element={<AddPayout />} />

                            {/* Writers */}
                            <Route path={AdminRoutes.LIST_WRITERS} element={<ListWriters />} />
                            <Route path={AdminRoutes.ADD_WRITER} element={<AddWriter />} />
                            <Route path={AdminRoutes.SINGLE_WRITER} element={<SingleWriter />} />

                            {/* Sources */}
                            <Route path={AdminRoutes.LIST_SOURCES} element={<ListSources />} />
                            <Route path={AdminRoutes.ADD_SOURCE} element={<AddSource />} />
                            <Route path={AdminRoutes.SINGLE_SOURCE} element={<SingleSource />} />

                            {/* 404 */}
                            {/* <Route path="*" element={<NotFound />} /> */}

                        </Routes>

                    </div>
                </div>

            </BrowserRouter>

        </>

    );
}

export default AdminApp;

if (document.getElementById('admin_app')) {
    ReactDOM.render(<AdminProvider><AdminApp /></AdminProvider>, document.getElementById('admin_app'));
}
