import { useEffect } from "react"
import { showError } from "../Helpers/Misc"
import { get } from "../Helpers/Request"

const useGetItem = (url, callback) => {
    useEffect(() => {
        get(url)
            .then(item => {
                callback(item)
            })
            .catch(error => {
                console.log(error)
                callback(null)
                showError('An exception occurred')
            })
    }, [url])
}

export { useGetItem }
