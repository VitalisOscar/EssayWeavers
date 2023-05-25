import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../Context/AdminContext';
import Sidenav from './Sidenav';

export default function Header() {
    const {adminData} = useContext(AdminContext)

    const [sidenavOpen, setSidenavOpen] = useState(false)

    // Set page title from data
    useEffect(() => {
        document.title = adminData.pageTitle ?? 'Administration';
    })

    return (
        <>

            <header className='bg-indigo'>
                <nav className="navbar navbar-top navbar-expand navbar-dark bg-indigo border-0">
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
                                        <i className={adminData.headerIcon}></i>
                                    </span>
                                    <span>{adminData.headerName}</span>
                                </h3>
                            </div>

                        </div>
                    </div>
                </nav>

            </header>

            <Sidenav open={sidenavOpen} setOpen={setSidenavOpen} />

        </>
    );
}
