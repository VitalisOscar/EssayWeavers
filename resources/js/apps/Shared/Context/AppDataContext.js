import React from "react";

const AppDataContext = React.createContext();

function AppDataProvider({ children }){
    const [appData, setAppData] = useState({})

    return <AppDataContext.Provider value={{data, setData}}>{children}</AppDataContext.Provider>
}

export { AppDataContext, AppDataProvider }
