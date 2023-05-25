import { useContext, useEffect } from "react";
import UpdatePassword from "../../../Shared/UI/Account/UpdatePassword";
import { AdminContext } from "../../Context/AdminContext";

export default function Password(){
    const {adminData, setAdminData} = useContext(AdminContext)
    useEffect(() => {
        setAdminData({
            ...adminData,
            pageTitle: 'Update Password',
            headerName: 'Update Password',
            headerIcon: 'fa fa-lock',
        })
    }, [])

    return (
        <UpdatePassword guard='admin' />
    );

}
