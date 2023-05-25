import { useEffect, useState } from "react";
import { generateUrl } from "../../Shared/Helpers/Misc";
import { get } from "../../Shared/Helpers/Request";
import { AdminApi } from "../Config/AdminApi";

function useSourceTypes(){
    var [sourceTypes, setSourceTypes] = useState([])

    useEffect(() => {

        get(generateUrl(AdminApi.ORDER_SOURCE_TYPES))
            .then((data) => {
                setSourceTypes(data)
            })
            .catch((error) => console.log(error))

    }, [])

    return sourceTypes
}

function useSources(type = null){
    var [sources, setSources] = useState([])

    useEffect(() => {

        get(generateUrl(AdminApi.ORDER_SOURCES, {type: type}))
            .then((data) => {
                setSources(data)
            })
            .catch((error) => console.log(error))

    }, [])

    return sources
}

export { useSourceTypes, useSources }
