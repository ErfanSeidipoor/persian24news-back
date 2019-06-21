const { UserModel } = require('../../../models/user')
const { TagModel } = require('../../../models/tag')
const mongoose = require('mongoose')
const request = require('supertest')

describe('(routes ) api/user/tag ', ()=>{
    let body;
    let server;
    let response;
    let token;


        
    const loginExec = ()=>{
        return request(server)
            .post('/api/auth/')
            .send(body)
            .ok(_=>true)
    }
    
    const createUserExec = ()=>{
        return request(server)
        .post('/api/user/')
        .send(body)
        .ok(_=>true)
    }

    const getUserTagsExec = ()=>{
        return request(server)
            .get('/api/user/tag')
            .send(body)
            .set('x-auth-token', token)
            .ok(_=>true)
    }
    const getUserTagExec = id =>{
        return request(server)
            .get(`/api/user/tag/${id}`)
            .send(body)
            .set('x-auth-token', token)
            .ok(_=>true)
    }
    
    const addUserTagExec = () =>{
        return request(server)
            .put(`/api/user/tag`)
            .send(body)
            .set('x-auth-token', token)
            .ok(_=>true)
    }

    const removeUserTagExec = () =>{
        return request(server)
            .delete(`/api/user/tag`)
            .send(body)
            .set('x-auth-token', token)
            .ok(_=>true)
    }

    beforeEach( async ()=>{
        server = require('../../../index')
    })
    afterEach( async () =>{
        await server.close();
        await UserModel.remove({})
        await TagModel.remove({})
    })
    afterAll( async () =>{
        await mongoose.connection.close()
        await server.close();
    })

    describe('/api/user/tag (get) user can get list of its tags',()=>{
        
        it("it should return 401 if x-auth-token is undefined", async ()=>{
            
            token = ""
            body = {}
            response = await getUserTagExec("234234")
            expect(response.status).toBe(401);

        })

        it("it should return 404 if user not found", async ()=>{
            body = {
                username: "erfanSeidipoor",
                password: "123456",
            }
            response = await createUserExec();
            await UserModel.remove({})
            expect(response.status).toBe(200);
            expect(response.header).toHaveProperty('x-auth-token')

            token = response.header['x-auth-token'];
            body = {}
            response = await getUserTagsExec()
            expect(response.status).toBe(404);

        })

        it("it should return 200 && it should return array of object with 'name' and '_id' property", async()=>{
            body = {
                username: "erfanSeidipoor",
                password: "123456",
            }
            response = await createUserExec();

            expect(response.status).toBe(200);
            expect(response.header).toHaveProperty('x-auth-token')

            token = response.header['x-auth-token'];
            body = {}
            response = await getUserTagsExec()
            expect(response.status).toBe(200);
        })
    })

    describe('/api/user/tag/:id (get) user can get its tag properties with given id', ()=>{

        it("it should return 401 if x-auth-token is undefined", async ()=>{
            token = ""
            body = {}
            response = await getUserTagsExec()
            expect(response.status).toBe(401);
        })

        it("it should return 400 if user not found", ()=>{
            
        })

        it("it should return 200 && it should return object with 'name' property", ()=>{

        })
    })

    describe('/api/user/tag (put) user can add tag to its tags array', ()=>{

        it("it should return 401 if x-auth-token is undefined", ()=>{

        })

        it("it should return 400 if shape of boby is different", ()=>{

        })

        it("it should return 400 if user not found", ()=>{

        })

        it("it should return 409 if tag already exist", ()=>{

        })

        it("it should return 200 && it should return user object with 'username','_id' nad 'tags' property", async ()=>{
            body = {
                username: "erfanSeidipoor",
                password: "123456",
            }
            response = await createUserExec();

            expect(response.status).toBe(200);
            expect(response.header).toHaveProperty('x-auth-token')

            token = response.header['x-auth-token'];

            const tag = await new TagModel({ value: "perspolise" }).save()

            console.log(tag)
            body = {
                _id: tag._id,
                value: "perspolise",
            }
            response = await addUserTagExec()

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('username',"erfanSeidipoor")
            expect(response.body).toHaveProperty('_id')
            expect(response.body).not.toHaveProperty('password')
            
            expect(response.body).toHaveProperty('tags')
            expect(response.body.tags[0]).toHaveProperty('tagId',String(tag._id))
            expect(response.body.tags[0]).toHaveProperty('tagValue',"perspolise")
            
        })
    })

    describe('/api/user/tag (delete) user can delete tag from its tags array', ()=>{

        it("it should return 401 if x-auth-token is undefined", ()=>{

        })

        it("it should return 400 if shape of boby is different", ()=>{

        })

        it("it should return 400 if user not found", ()=>{

        })

        it("it should return 409 if tag not found", ()=>{

        })

        it("it should return 200 && it should return object with 'name' and '_id' property", ()=>{

        })
    })
})