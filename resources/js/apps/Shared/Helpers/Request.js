

const get = (url) => {
    return sendRequest(url)
}

const post = (url, data) => {
    return sendRequest(url, {
        method: 'POST',
        body: data
    });
}

function sendRequest(url, options = {}){
    if(options.method && options.method.toUpperCase() == 'POST'){
        return axios.post(url, options.body)
            .then(response => response.data)
    }

    return axios.get(url, options)
        .then(response => response.data)
}

export { get, post }
