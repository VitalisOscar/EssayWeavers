import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { WriterRoutes } from './Config/WriterRoutes';
import { WriterProvider } from './Context/WriterContext';
import Header from './UI/Components/Header';
import Dashboard from './UI/Pages/Dashboard';
import ListOrders from './UI/Pages/Orders/ListOrders';
import SingleOrder from './UI/Pages/Orders/Single/SingleOrder';
import Password from './UI/Pages/Password';
import ListEarnings from './UI/Pages/Payments/ListEarnings';
import ListFines from './UI/Pages/Payments/ListFines';
import ListPayouts from './UI/Pages/Payments/ListPayouts';

function WriterApp() {
    function validateStatus(status) {
        let allowed = ['allocated', 'active', 'completed', 'need-review', 'cancelled', 'settled']
        return allowed.indexOf(status) != -1;
    }

    return (
        <>

            <BrowserRouter basename="writer">
                <WriterProvider>
                    <Header />

                    <div className="main-content" id="panel">

                        {/* MAIN CONTENT */}
                        <div className="p-5 container-fluid" style={{zIndex: "3", position: "relative"}}>

                            <Routes>

                                <Route path={WriterRoutes.DASHBOARD} element={<Dashboard />} />
                                <Route path={WriterRoutes.UPDATE_PASSWORD} element={<Password />} />

                                {/* Orders */}
                                <Route path={WriterRoutes.LIST_ORDERS} validate={validateStatus} element={<ListOrders />} />
                                <Route path={WriterRoutes.SINGLE_ORDER + '/*'} element={<SingleOrder />} />

                                {/* Payments */}
                                <Route path={WriterRoutes.LIST_PAYOUTS} element={<ListPayouts />} />
                                <Route path={WriterRoutes.LIST_EARNINGS} element={<ListEarnings />} />
                                <Route path={WriterRoutes.LIST_FINES} element={<ListFines />} />

                                {/* 404 */}
                                <Route path="*" element={<div>Not Found</div>} />

                            </Routes>

                        </div>
                    </div>

                </WriterProvider>
            </BrowserRouter>

        </>
    );
}

export default WriterApp;

if (document.getElementById('writer_app')) {
    ReactDOM.render(<WriterApp />, document.getElementById('writer_app'));
}
