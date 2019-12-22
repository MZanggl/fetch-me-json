module.exports = class FetchSpyFactory {

    constructor(fakeResponse = {}) {
        if (!fakeResponse.hasOwnProperty('body')) fakeResponse.body = {}
        if (!fakeResponse.hasOwnProperty('ok')) fakeResponse.ok = true
        if (!fakeResponse.hasOwnProperty('status')) {
            fakeResponse.status = fakeResponse.ok ? 200 : 500
        }
    
        let fetchResponse = {}
        global.fetch = async (endpoint, parameters = {}) => {
            return {
                ok: fakeResponse.ok,
                status: fakeResponse.status,
                async json() {
                    fetchResponse = {
                        meta: {
                            endpoint,
                            parameters,
                        },
                    }
        
                    // return dummy data
                    return fakeResponse.body
                }
            }
        }
    
        return async action => {
            await action()
            return fetchResponse
        }
    }
}