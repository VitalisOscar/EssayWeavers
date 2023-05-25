import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AdminRoutes } from '../../Config/AdminRoutes';

export default function Sidenav({ open, setOpen }) {

    const groups = [
        {
            name: "ORDERS",
            matches: 'orders',
            links: [
                {
                    to: AdminRoutes.LIST_ORDERS,
                    text: 'List Orders',
                    icon: 'fas fa-book'
                },
                {
                    to: AdminRoutes.ADD_ORDER,
                    text: 'Add New Order',
                    icon: 'fa fa-plus'
                },
            ]
        },

        {
            name: "PAYOUTS",
            matches: 'payouts',
            links: [
                {
                    to: AdminRoutes.LIST_PAYOUTS,
                    text: 'Payout History',
                    icon: 'fas fa-money-check'
                },
                {
                    to: AdminRoutes.ADD_PAYOUT,
                    text: 'Record a Payout',
                    icon: 'fas fa-coins'
                },
            ]
        },

        {
            name: "WRITERS",
            matches: 'writers',
            links: [
                {
                    to: AdminRoutes.LIST_WRITERS,
                    text: 'My Writers',
                    icon: 'fas fa-chalkboard-teacher'
                },
                {
                    to: AdminRoutes.ADD_WRITER,
                    text: 'Add Writer',
                    icon: 'fa fa-user-plus'
                },
            ]
        },

        {
            name: "ORDER SOURCES",
            matches: 'sources',
            links: [
                {
                    to: AdminRoutes.LIST_SOURCES,
                    text: 'Manage Sources',
                    icon: 'fas fa-tags'
                },
                {
                    to: AdminRoutes.ADD_SOURCE,
                    text: 'Add Source',
                    icon: 'fas fa-plus'
                },
            ]
        },

    ]

    return (
        <nav className={(open ? "open ":"") + "sidenav navbar navbar-vertical fixed-left navbar-expand-xs navbar-dark bg-gradient-darker pb-0"} id="sidenav-main">
            <div style={{overflowX: "hidden !important", overflowY: "auto", scrollbarWidth: 'thin'}} className="scrollbar-inner">

                {/* HEADER */}
                <div className="sidenav-header text-left d-flex align-items-center mb-0">
                    <NavLink to={AdminRoutes.DASHBOARD} className="navbar-brand font-weight-700 mr-0" >
                        {/* <img src="static/img/nav_logo.png" className="img-fluid" alt="VMS" style={{maxWidth: "160px"}} /> */}
                        StarWriters
                    </NavLink>

                    <div className="ml-auto mr-3 sidenav-toggler sidenav-toggler-dark px-0 d-xl-none" data-action="sidenav-pin" data-target="#sidenav-main">
                        <span className="sidenav-toggler-inner" onClick={() => setOpen(false)}>
                            <i className="fa fa-times close text-white"></i>
                        </span>
                    </div>
                </div>

                <div className="navbar-inner">

                    <div className="collapse navbar-collapse" id="sidenav-collapse-main">

                        {/* NAV PAGES */}
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink to={AdminRoutes.DASHBOARD} className="nav-link " >
                                    <i className="ni ni-tv-2 text-primary"></i>
                                    <span className="nav-link-text">Dashboard</span>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to={AdminRoutes.UPDATE_PASSWORD} className="nav-link " >
                                    <i className="fa fa-lock text-primary"></i>
                                    <span className="nav-link-text">Update Password</span>
                                </NavLink>
                            </li>

                        </ul>


                        {
                            groups.map((group) => {

                                const linkActive = location.pathname.includes(group.matches)

                                return (
                                    <div key={group.name} className="navbar-nav mb-0">
                                        <div className={linkActive ? "nav-item title" : "nav-item title"}>
                                            <a className="nav-link collapse-toggle" aria-expanded={linkActive} data-toggle="collapse" data-target={"#nav-" + group.matches}>
                                                <span className="nav-link-text">{group.name}</span>
                                            </a>
                                        </div>

                                        <div className={linkActive ? "collapse show" : "collapse"} id={"nav-" + group.matches}>
                                            {
                                                group.links.map((link) => {
                                                    return (
                                                        <div key={link.to} className="nav-item px-2">
                                                            <NavLink to={link.to} className="nav-link px-3" >
                                                                <i className={link.icon}></i>
                                                                <span className="nav-link-text">{link.text}</span>
                                                            </NavLink>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )

                            })
                        }


                    </div>
                </div>

                <div className="navbar-inner pb-3">

                    <div className="text-center mt-4">
                        <a href="/logout/admin" className="btn btn-link text-danger">
                            <i className="fa fa-power-off mr-1"></i>Log Out
                        </a>
                    </div>
                </div>

            </div>
        </nav>
    );
}
