import React, { useContext, useEffect, useState } from 'react';
import { WriterContext } from '../../Context/WriterContext';
import Sidenav from './Sidenav';
import {Link} from "react-router-dom";
import {WriterRoutes} from "../../Config/WriterRoutes";

export default function Header() {
    const {writerData} = useContext(WriterContext)

    const [sidenavOpen, setSidenavOpen] = useState(false)

    // Set page title from data
    useEffect(() => {
        document.title = writerData.pageTitle ?? 'Writer';
    })

    return (
        <>

            <header className="bg-success">
                <nav className="navbar navbar-top navbar-expand navbar-dark bg-success border-0">
                    <div className="container-fluid">
                        <div className="d-flex align-items-center collapse navbar-collapse border-0" id="navbarSupportedContent">

                            <div title="Open Menu" className="p-3 mr-2 sidenav-toggler sidenav-toggler-dark d-xl-none rounded" onClick={() => setSidenavOpen(!sidenavOpen)}>
                                <div className="sidenav-toggler-inner">
                                    <i className="sidenav-toggler-line"></i>
                                    <i className="sidenav-toggler-line"></i>
                                    <i className="sidenav-toggler-line"></i>
                                </div>
                            </div>

                            <div className="d-flex align-items-center" style={{width: "calc(100%)"}}>
                                <h3 style={{textTransform: 'none'}} className="d-flex align-items-center font-weight-800 heading-title text-truncate text-white mb-0 mr-auto">
                                    <span className="page-icon">
                                        <i className={writerData.headerIcon}></i>
                                    </span>
                                    <span>{writerData.headerName}</span>
                                </h3>

                                {
                                    writerData.profile &&
                                    <div className="ml-auto dropdown">
                                        <button className="btn btn-outline-white dropdown-toggle" data-toggle={"dropdown"}>
                                            <i className="fa fa-user-o mr-1"></i>{writerData.profile.name}
                                        </button>

                                        <ul className="dropdown-menu dropdown-menu-right mr-4">
                                            <li className="dropdown-item">
                                                <Link to={WriterRoutes.UPDATE_PASSWORD} className="dropdown-link">
                                                    <i className="fa fa-lock icon colored-icon icon-sm bg-primary"></i>
                                                    Update Password
                                                </Link>
                                            </li>

                                            <li className="dropdown-divider my-0"></li>

                                            <li className="dropdown-item">
                                                <a href="/logout/writer" className="dropdown-link">
                                                    <i className="fa fa-power-off icon colored-icon icon-sm bg-warning"></i>
                                                    Log out
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                }
                            </div>

                        </div>
                    </div>
                </nav>

            </header>

            <Sidenav open={sidenavOpen} setOpen={setSidenavOpen} />

        </>
    );
}
