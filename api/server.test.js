const request = require('supertest')
const server = require('./server')

test("sanity", ()=>{
    expect(true).toBe(true)
})

describe("GET /", ()=>{
    it('connects to the server', async() => {
        const response = await request(server).get("/")
        console.log(response)
        expect (response.status).toEqual(200)

    });
    
})