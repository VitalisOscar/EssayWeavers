import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { generateUrl } from '../../../Shared/Helpers/Misc';
import { get } from '../../../Shared/Helpers/Request';
import { WriterApi } from '../../Config/WriterApi';
import { WriterRoutes } from '../../Config/WriterRoutes';

export default function Sidenav({ open, setOpen }) {

    useEffect(fetchCounters, [])

    // setInterval(fetchCounters, 60000)

    const [groups, setGroups] = useState([
        {
            name: "ORDERS",
            matches: 'orders',
            links: [
                {
                    to: generateUrl(WriterRoutes.LIST_ORDERS, {status: 'allocated'}),
                    text: 'New',
                    icon: 'fa fa-users'
                },
                {
                    to: generateUrl(WriterRoutes.LIST_ORDERS, {status: 'active'}),
                    text: 'In Progress',
                    icon: 'fa fa-users'
                },
                {
                    to: generateUrl(WriterRoutes.LIST_ORDERS, {status: 'completed'}),
                    text: 'Completed',
                    icon: 'fa fa-users'
                },
                {
                    to: generateUrl(WriterRoutes.LIST_ORDERS, {status: 'need-review'}),
                    text: 'Need Review',
                    icon: 'fa fa-users'
                },
                {
                    to: generateUrl(WriterRoutes.LIST_ORDERS, {status: 'settled'}),
                    text: 'Settled',
                    icon: 'fa fa-users'
                },
                {
                    to: generateUrl(WriterRoutes.LIST_ORDERS, {status: 'cancelled'}),
                    text: 'Cancelled',
                    icon: 'fa fa-users'
                },
            ]
        },

        {
            name: "PAYMENTS",
            matches: 'payments',
            links: [
                {
                    to: WriterRoutes.LIST_EARNINGS,
                    text: 'My Earnings',
                    icon: 'fa fa-users'
                },
                {
                    to: WriterRoutes.LIST_PAYOUTS,
                    text: 'Paid Out',
                    icon: 'fa fa-users'
                },
                {
                    to: WriterRoutes.LIST_FINES,
                    text: 'Fines',
                    icon: 'fa fa-users'
                }
            ]
        },

    ])


    const location = useLocation()

    function fetchCounters(){
        get(WriterApi.GET_ORDER_STATUS_COUNTERS)
            .then(result => {
                groups.forEach(group => {
                    if(group.name == 'ORDERS'){
                        group.links.forEach(link => {
                            if(link.text == 'New'){
                                link.counter = result.new
                            }

                            if(link.text == 'Need Review'){
                                link.counter = result.need_review
                            }
                        })
                    }
                })

                setGroups([...groups])
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <nav className={(open ? "open ":"") + "sidenav navbar navbar-vertical fixed-left navbar-expand-xs navbar-dark bg-gradient-darker pb-0"} id="sidenav-main">
            <div style={{overflowX: "hidden !important", overflowY: "auto", scrollbarWidth: 'thin'}} className="scrollbar-inner">

                {/* HEADER */}
                <div className="sidenav-header text-left d-flex align-items-center mb-0">
                    <NavLink to={WriterRoutes.DASHBOARD} className="navbar-brand font-weight-700 mr-0" >
                        {/* <img src="static/img/nav_logo.png" className="img-fluid" alt="VMS" style={{maxWidth: "160px"}} /> */}
                        EssayWeavers
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
                                <NavLink to={WriterRoutes.DASHBOARD} className="nav-link " >
                                    <i className="ni ni-tv-2 text-primary"></i>
                                    <span className="nav-link-text">Dashboard</span>
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to={WriterRoutes.UPDATE_PASSWORD} className="nav-link " >
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
                                                                {
                                                                    link.counter && link.counter > 0 ?
                                                                    <span className="badge badge-danger ml-auto">{link.counter}</span>
                                                                    : <></>
                                                                }
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
                        <a href="/logout/writer" className="btn btn-link text-danger">
                            <i className="fa fa-power-off mr-1"></i>Log Out
                        </a>
                    </div>
                </div>

            </div>
        </nav>
    );
}
