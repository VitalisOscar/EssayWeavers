import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { generateUrl } from "../../Shared/Helpers/Misc";
import { useGetItem } from "../../Shared/Hooks/Request";
import { AdminApi } from "../Config/AdminApi";

const OrderContext = React.createContext();

function OrderProvider({ children }){
    const [order, setOrder] = useState(null)

    return (
        <OrderContext.Provider value={{order, setOrder}}>
            {children}
        </OrderContext.Provider>
    )
}

export { OrderContext, OrderProvider }
