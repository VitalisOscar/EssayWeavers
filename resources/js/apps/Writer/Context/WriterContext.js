import React, { useEffect, useState } from "react";
import {get} from "../../Shared/Helpers/Request";
import {WriterApi} from "../Config/WriterApi";

const WriterContext = React.createContext();

function WriterProvider({ children }){
    const [writerData, setWriterData] = useState({
        headerName: '',
        headerIcon: '',
        pageTitle: '',
        profile: null
    })

    useEffect(getProfile, [])

    function getProfile(){
        get(WriterApi.PROFILE)
            .then(response => {
                if(response.data){
                    setWriterData({ ...writerData, profile: response.data })
                }
            })
    }

    return <WriterContext.Provider value={{writerData, setWriterData}}>{children}</WriterContext.Provider>
}

export { WriterContext, WriterProvider }
