const withQuery = require('with-query').default

class HttpError extends Error {
    constructor(message, status) {
        super(message);
        this.message = message // super stringifies message
        this.name = 'HttpError';
        this.status = status
    }
}

const JSONFetch = {
    configurations: {},
    HttpError,
    config(configurations = {}) {
        this.configurations.fetch = configurations.fetch || {}
        this.configurations.defaultPayload = configurations.defaultPayload || {}
        this.configurations.errorKey = typeof configurations.errorKey !== 'undefined' ? configurations.errorKey : 'message'
    },
}

// initialize with default options
JSONFetch.config()

const methods = ['get', 'head', 'post', 'put', 'patch', 'delete', 'options']
methods.forEach(method => {
    JSONFetch[method] = async (url, payload = {}) => await send({ method, url, payload })
})

async function send(parameters) {
    parameters = transformParameters(parameters)
    const fetchParameters = getFetchParameters(parameters.method, parameters.payload)
    const response = await fetch(parameters.url, fetchParameters)
    return await parseResponseOrFail(response)
}

function isGet(method) {
    return ['get', 'head'].indexOf(method) >= 0
}

function transformParameters(parameters) {
    if (Object.keys(JSONFetch.configurations.defaultPayload).length > 0) {
        parameters.payload = {...JSONFetch.configurations.defaultPayload, ...parameters.payload}
    }

    if (isGet(parameters.method)) {
        parameters.url = withQuery(parameters.url, parameters.payload)
    }

    return parameters
}

function getFetchParameters(method, payload) {
    return {
        method,
        body: isGet(method) ? null : JSON.stringify(payload),
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        ...JSONFetch.configurations.fetch
    }
}

async function parseResponseOrFail(response) {
    const body = await response.json().catch(() => ({ })) || {} // if no response, avoid crashing by falling back to empty Object

    if (!response.ok) {
        const error = JSONFetch.configurations.errorKey ? body[JSONFetch.configurations.errorKey] : body
        throw new HttpError(error || 'internal server error', response.status)
    }

    return body
}

module.exports = JSONFetch