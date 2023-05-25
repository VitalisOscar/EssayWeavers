import React, { useEffect, useState } from "react";

const AdminContext = React.createContext();

function AdminProvider({ children }){
    const [adminData, setAdminData] = useState({
        pageHeader: '',
        pageIcon: '',
        pageTitle: '',
        cache: {},
        modalOpen: false,
        modalContent: <></>,
        hasStats: false,
    })

    if(adminData.modalOpen){
        $('#mainModal').modal('show', {
            backdrop: 'static'
        })
        adminData.modalOpen = false
    }

    return (
        <AdminContext.Provider value={{adminData, setAdminData}}>
            {children}

            <div className="modal fade" id="mainModal" data-backdrop="static">
                <div className="modal-dialog">

                    <div className="modal-content">
                        <div>
                            {adminData.modalContent}
                        </div>
                    </div>

                </div>
            </div>
        </AdminContext.Provider>
    )
}

export { AdminContext, AdminProvider }
