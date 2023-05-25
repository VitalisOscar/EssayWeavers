import React, { useEffect, useState } from "react";

const WriterContext = React.createContext();

function WriterProvider({ children }){
    const [writerData, setWriterData] = useState({
        headerName: '',
        headerIcon: '',
        pageTitle: '',
    })

    return <WriterContext.Provider value={{writerData, setWriterData}}>{children}</WriterContext.Provider>
}

export { WriterContext, WriterProvider }
