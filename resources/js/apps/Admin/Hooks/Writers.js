import { useEffect, useState } from "react";
import { generateUrl } from "../../Shared/Helpers/Misc";
import { get } from "../../Shared/Helpers/Request";
import { AdminApi } from "../Config/AdminApi";

function useWriters(){
    var [writers, setWriters] = useState([])

    useEffect(() => {

        get(generateUrl(AdminApi.WRITERS))
            .then((types) => {
                setWriters(types)
            })
            .catch((error) => console.log(error))

    }, [])

    return writers
}

export { useWriters }
