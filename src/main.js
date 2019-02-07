const JSONFetch = {}

/**
 * @typedef {Object} Configurations
 * @property {Object} fetch parameters to be passed down to the global fetch method (not get), overrides existing parameters
 * @property {Object} defaultParameters define default parameters you always want to pass along
 * @property {String} errorKey default to `message`. In the case of an error what key should be thrown
 */

/**
 * @param {Configurations} configurations
 */
JSONFetch.config = configurations => JSONFetch.configurations = configurations

/**
 * High level API for fetch's GET request. 
 * @param {string} url 
 * @param {object} parameters 
 */
JSONFetch.get = async (url, parameters = {}) => {
    if (JSONFetch.configurations.defaultParameters){
        parameters = {...JSONFetch.configurations.defaultParameters, ...parameters}
    }

    const urlWithQuery = _withQuery(url, parameters)
    const response = await fetch(urlWithQuery)
    const body = await response.json()

    if (!response.ok) throw Error(body.message)

    return body
}

/**
 * High level API for fetch's PUT request. 
 * @param {string} url 
 * @param {object} parameters 
 */
JSONFetch.put = async (url, parameters = {}) => await _send(url, 'put', parameters)

/**
 * High level API for fetch's POST request. 
 * @param {string} url 
 * @param {object} parameters 
 */
JSONFetch.post = async (url, parameters = {}) => await _send(url, 'post', parameters)

/**
 * High level API for fetch's DELETE request. 
 * @param {string} url 
 * @param {object} parameters 
 */
JSONFetch.delete = async (url, parameters = {}) => await _send(url, 'delete', parameters)

/**
 * High level API for fetch's PATCH request. 
 * @param {string} url 
 * @param {object} parameters 
 */
JSONFetch.patch = async (url, parameters = {}) => await _send(url, 'patch', parameters)

async function _send(url, method, parameters = {}) {
    if (JSONFetch.configurations.defaultParameters){
        parameters = {...JSONFetch.configurations.defaultParameters, ...parameters}
    }

    const overrideFetchParameters = JSONFetch.configurations.fetch || {}
    const fetchParameters = {
        method,
        body: JSON.stringify(parameters),
        mode: 'same-origin',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        ...overrideFetchParameters
    }

    const response = await fetch(url, fetchParameters)

    const body = await response.json().catch(() => {}) // if no response, avoid crash by falling back to empty Object

    if (!response.ok) {
        const errorKey = JSONFetch.configurations.errorKey || 'message'
        throw Error(body[errorKey] || 'internal server error')
    }

    return body
}

function _withQuery(url, parameters) {
    return Object.keys(parameters).reduce((fullUrl, key) => {
        const seperator = fullUrl.includes('?') ? '&' : '?'
        return `${fullUrl}${seperator}${key}=${parameters[key] || ''}`
    }, url)
}

export default JSONFetch