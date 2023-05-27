import React, { useEffect, useState } from "react";
import {get} from "../../Shared/Helpers/Request";
import {WriterApi} from "../../Writer/Config/WriterApi";
import {AdminApi} from "../Config/AdminApi";

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
        profile: null
    })

    useEffect(getProfile, [])

    function getProfile(){
        get(AdminApi.PROFILE)
            .then(response => {
                if(response.data){
                    setAdminData({ ...adminData, profile: response.data })
                }
            })
    }

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
