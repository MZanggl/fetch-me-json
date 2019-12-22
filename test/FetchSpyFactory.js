module.exports = class FetchSpyFactory {

    constructor(fakeResponse = {}) {
        if (!fakeResponse.hasOwnProperty('body')) fakeResponse.body = {}
        if (!fakeResponse.hasOwnProperty('ok')) fakeResponse.ok = true
    
        let fetchResponse = {}
        global.fetch = async (endpoint, parameters = {}) => {
            return {
                ok: fakeResponse.ok,
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