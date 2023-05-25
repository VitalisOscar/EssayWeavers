import { useContext, useEffect } from "react";
import UpdatePassword from "../../../Shared/UI/Account/UpdatePassword";
import { WriterContext } from "../../Context/WriterContext";

export default function Password(){
    const {writerData, setWriterData} = useContext(WriterContext)
    useEffect(() => {
        setWriterData({
            ...writerData,
            pageTitle: 'Update Password',
            headerName: 'Update Password',
            headerIcon: 'fa fa-lock',
        })
    }, [])

    return (
        <UpdatePassword guard='writer' />
    );

}
