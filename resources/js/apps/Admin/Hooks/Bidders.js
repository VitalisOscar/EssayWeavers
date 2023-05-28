import { useEffect, useState } from "react";
import { generateUrl } from "../../Shared/Helpers/Misc";
import { get } from "../../Shared/Helpers/Request";
import { AdminApi } from "../Config/AdminApi";

function useBidders(type = null){
    var [bidders, setBidders] = useState([])

    useEffect(() => {

        get(generateUrl(AdminApi.ORDER_BIDDERS))
            .then((data) => {
                setBidders(data)
            })
            .catch((error) => console.log(error))

    }, [])

    return bidders
}

export { useBidders }
