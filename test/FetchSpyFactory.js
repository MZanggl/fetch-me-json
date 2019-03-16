module.exports = class FetchSpyFactory {

    constructor(options = {}) {
        if (!options.hasOwnProperty('fakeJSONResponse')) options.fakeJSONResponse = {}
        if (!options.hasOwnProperty('ok')) options.ok = true
    
        let fetchResponse = {}
        global.fetch = async (endpoint, parameters = {}) => {
            return {
                ok: options.ok,
                async json() {
                    fetchResponse = {
                        meta: {
                            endpoint,
                            parameters,
                        },
                    }
        
                    // return dummy data
                    return options.fakeJSONResponse
                }
            }
        }
    
        return async action => {
            await action()
            return fetchResponse
        }
    }
}