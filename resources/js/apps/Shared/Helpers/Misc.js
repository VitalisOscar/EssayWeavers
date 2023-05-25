import Swal from "sweetalert2";

/**
 * Get a url, with params in the form of :param replaced with their values
 *
 * @param url The api endpoint that will handle the request
 * @param params Url params
 * @param searchOptions Search options to appear after ?
 */
const generateUrl = (url, params = {}) => {
    let searchOptions = {};

    if(params){
        for(const param in params){
            if(url.includes(param)){
                url = url.replace(`:${param}`, params[param])
            }else{
                // Will add it to search options
                searchOptions[param] = params[param];
            }
        };
    }

    var queryParams = []

    for(const option in searchOptions){
        queryParams.push(option + "=" + searchOptions[option])
    }

    // Sort the params and join them
    if(queryParams.length > 0){
        url += "?" + queryParams.sort().join("&")
    }

    return url
}

/**
 * Get the number of an item in a result set
 *
 * @param itemIndex The index of the item in the latest result set
 * @param page The current page number
 * @param limit The limit of items per page
 */
const getItemNumber = (itemIndex, page, limit) => {
    return (page - 1) * limit + itemIndex + 1;
}

/**
 * Error reporting message
 */
const showError = (message) => {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
    })
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'error',
        title: message
    })
}

const showSuccess = (message) => {
    if($('#mainModal')) $('#mainModal').modal('hide')

    Swal.fire({
        position: 'center',
        icon: 'success',
        title: message,
        showConfirmButton: true,
        timer: 3500
    })
}

const confirmAction = (config, callback) => {
    Swal.fire({
        title: config.title || 'Confirm',
        text: config.message || 'Please confirm the action',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Continue'
    }).then((result) => {
        if (result.isConfirmed) {
            callback()
        }
    })
}

export { generateUrl, getItemNumber, showError, showSuccess, confirmAction }
