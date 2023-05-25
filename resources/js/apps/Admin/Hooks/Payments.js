import { useEffect, useState } from "react";
import { generateUrl } from "../../Shared/Helpers/Misc";
import { get } from "../../Shared/Helpers/Request";
import { AdminApi } from "../Config/AdminApi";

function usePaymentRecepientTypes(){
    var [recepientTypes, setRecepientTypes] = useState([])

    useEffect(() => {

        get(generateUrl(AdminApi.PAYMENT_RECEPIENT_TYPES))
            .then((types) => {
                setRecepientTypes(types)
            })
            .catch((error) => console.log(error))

    }, [])

    return recepientTypes
}

function usePaymentRecepients(recepientType){
    var [recepients, setRecepients] = useState([])

    useEffect(() => {
        if(recepientType == '') return

        get(generateUrl(AdminApi.PAYMENT_RECEPIENTS, {
            recepient_type: recepientType
        }))
            .then((recepients) => {
                setRecepients(recepients)
            })
            .catch((error) => console.log(error))

    }, [recepientType])

    return recepients
}

export { usePaymentRecepientTypes, usePaymentRecepients }
