const chai = require('chai')
const expect = chai.expect
const JSONFetch = require('../dist/main')
const FetchSpyFactory = require('./FetchSpyFactory')

beforeEach(function() {
    JSONFetch.config() // reset configurations
})

describe('configurations', function () {

    it('should send default parameters', async function () {
        const fetchSpy = new FetchSpyFactory()

        JSONFetch.config({
            defaultPayload: {
                token: '123456'
            }
        })
        const fetchResponse = await fetchSpy(() => {
            JSONFetch.get('/search', {
                artist: 'nujabes'
            })
        })

        expect(fetchResponse.meta.endpoint).to.equal('/search?token=123456&artist=nujabes')
    })

    it('should be able to override default parameters', async function () {
        const fetchSpy = new FetchSpyFactory()

        JSONFetch.config({
            defaultPayload: {
                token: '123456'
            }
        })
        const fetchResponse = await fetchSpy(() => {
            JSONFetch.get('/search', {
                token: '123'
            })
        })

        expect(fetchResponse.meta.endpoint).to.equal('/search?token=123')
    })

    it('should be able to override fetch parameters', async function () {
        const fetchSpy = new FetchSpyFactory()

        JSONFetch.config({
            fetch: {
                credentials: 'include',
            }
        })
        const fetchResponse = await fetchSpy(() => {
            JSONFetch.get('/search')
        })

        expect(fetchResponse.meta.parameters.credentials).to.equal('include')
    })

    // doesnt work
    it('should throw custom configured error key from failed response', async function () {
        const fetchSpy = new FetchSpyFactory({ ok: false, body: {
            error: 'test'
        }})

        JSONFetch.config({ errorKey: 'error' })

        return await fetchSpy(() => {
            return JSONFetch.get('/search').catch(e => {
                expect(e.message).to.equal('test')
            })
        })
    })
})

describe('fetch', function () {

    it('should put GET payload as part of query parameters in URL', async function () {
        const fetchSpy = new FetchSpyFactory()

        const fetchResponse = await fetchSpy(() => {
            JSONFetch.get('/search', {
                artist: 'nujabes'
            })
        })

        expect(fetchResponse.meta.endpoint).to.equal('/search?artist=nujabes')
    })

    it('should get correct fetch parameters for GET', async function () {
        const fetchSpy = new FetchSpyFactory()

        const fetchResponse = await fetchSpy(() => {
            JSONFetch.get('/search')
        })

        expect(fetchResponse.meta.parameters).to.deep.equal({
            method: 'get',
            body: null,
            mode: 'same-origin',
            credentials: 'same-origin',
            headers: { 
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
    })

    it('should get correct fetch parameters for POST', async function () {
        const fetchSpy = new FetchSpyFactory()

        const fetchResponse = await fetchSpy(() => {
            JSONFetch.post('/artist', {
                name: 'nujabes'
            })
        })

        expect(fetchResponse.meta.parameters).to.deep.equal({
            method: 'post',
            body: JSON.stringify({
                name: 'nujabes'
            }),
            mode: 'same-origin',
            credentials: 'same-origin',
            headers: { 
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
    })

    
})

describe('throws', () => {
    it('should throw error when response is not ok', async function () {
        const fetchSpy = new FetchSpyFactory({ ok: false })

        return await fetchSpy(() => {
            return JSONFetch.get('/search').catch(e => {
                expect(e).to.be.instanceOf(Error)
            })
        })

    })

    it('should throw error key from failed response', async function () {
        const fetchSpy = new FetchSpyFactory({ ok: false, body: {
            message: 'test'
        } })

        return await fetchSpy(() => {
            return JSONFetch.get('/search').catch(e => {
                expect(e.message).to.equal('test')
            })
        })
    })
})