const { UserModel } = require('../../../models/user')
const mongoose = require('mongoose')
const request = require('supertest')

describe('(routes ) api/user ', ()=>{
    let server;
    // let user;

    let body;
    let response;
    let token;

    const getUserExec = ()=>{
        return request(server)
            .get('/api/user/')
            .send(body)
            .set('x-auth-token', token)
            .ok(_=>true)
    }

    const getUserByIdExec = id=>{
        return request(server)
            .get(`/api/user/${id}`)
            .send(body)
            .set('x-auth-token', token)
            .ok(_=>true)
    }

    const getMyInfoExec = () =>{
        return request(server)
            .get(`/api/user/me`)
            .send(body)
            .set('x-auth-token', token)
            .ok(_=>true)
    }
    
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

    beforeEach( async ()=>{
        server = require('../../../index')
    })
    afterEach( async () =>{
        await server.close();
        await UserModel.remove({})
    })
    afterAll( async () =>{
        await mongoose.connection.close()
        await server.close();
    })

    describe('  api/user (post) create a new user', ()=>{
        it("it should return 409 if username already exist", async ()=>{
            body = {
                username: "erfanSeidipoor",
                password: "123456",
            }
            response = await createUserExec();

            body = {
                username: "erfanSeidipoor",
                password: "123456",
            }
            response = await createUserExec();

            expect(response.status).toBe(409)
        }) 
        it("it should return 400 if shape of boby is different", async ()=>{
            body = {
                username1: "erfanSeidipoor",
                password: "123456",
            }
            response = await createUserExec();
            expect(response.status).toBe(400)

            body = {
                username: "erfanSeidipoor",
                password1: "123456",
            }
            response = await createUserExec();
            expect(response.status).toBe(400)

            body = {
                username1: "erfanSeidipoor",
                password1: "123456",
            }
            response = await createUserExec();
            expect(response.status).toBe(400)
        })
        it("it should return 200 -- it should return body with 'username' and isAdmin -- it should return header that containe 'x-auth-token'", async ()=>{
            body = {
                username: "erfanSeidipoor",
                password: "123456",
            }
            
            response = await createUserExec();

            expect(response.header).toHaveProperty('x-auth-token')
            expect(response.body).toHaveProperty('username',"erfanSeidipoor")
            expect(response.body).toHaveProperty('isAdmin',false)
            expect(response.body).toHaveProperty('_id')
            expect(response.body).not.toHaveProperty('password')
            expect(response.status).toBe(200)
        })
    })

    describe('  api/user (get) admin can get a list of all user ', ()=>{
        it("it should return 401 if x-auth-token is undefined", async ()=>{
            body = {}
            token = ""
            response = await getUserExec()
            expect(response.status).toBe(401);
        })
        it("it should return 403 if user isn't admin", async ()=>{
            body = {
                username: "erfanSeidipoor",
                password: "123456",
            }
            response = await createUserExec();
            expect(response.status).toBe(200);

            body = {}
            token = response.header['x-auth-token']
            response = await getUserExec()
            expect(response.status).toBe(403);
        })
        it("it should return 200 &&  it should return all user recorded in db && it should return array of object that containe 'username', 'tags' and 'isAdmin' and '_id', doesn't have 'password'", async ()=>{
            body = {
                username: "erfanSeidipoor2",
                password: "1234562",
            }
            response = await createUserExec();
            expect(response.status).toBe(200);            
            
            body = {
                username: "erfanSeidipoor",
                password: "123456",
            }
            response = await createUserExec();
            expect(response.status).toBe(200);

            const admin = await UserModel.findOneAndUpdate({username:"erfanSeidipoor"},{isAdmin:true},{new:true})
            expect(admin.isAdmin).toBeTruthy()

            response = await loginExec()
            expect(response.status).toBe(200);

            token = response.body['x-auth-token'];
            response = await getUserExec()
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2)
            expect(response.body[0]).toHaveProperty("username")
            expect(response.body[0]).toHaveProperty("isAdmin")
            expect(response.body[0]).toHaveProperty("_id")
            expect(response.body[0]).toHaveProperty("tags")
            expect(response.body[0]).not.toHaveProperty("password")
        })
    })

    describe("  api/user/:id (get) admin can get a user's properties with given id from path", () => {
        it("it should return 401 if x-auth-token is undefined", async ()=>{
            body = {}
            token = ""
            response = await getUserByIdExec("12345678")
            expect(response.status).toBe(401);
        })
        it("it should return 403 if user isn't admin", async ()=>{
            body = {
                username: "erfanSeidipoor",
                password: "123456",
            }
            response = await createUserExec();
            expect(response.status).toBe(200);

            body = {}
            token = response.header['x-auth-token']
            response = await getUserByIdExec("123456789")
            expect(response.status).toBe(403);
        })
        it("it should return 200 && it should return user with given 'id' && it should return object that containe 'username', 'tags', 'id' and 'isAdmin' and doesn't have 'password'", async ()=>{
            body = {
                username: "erfanSeidipoor",
                password: "123456",
            }
            response = await createUserExec();
            expect(response.status).toBe(200);

            const admin = await UserModel.findOneAndUpdate({username:"erfanSeidipoor"},{isAdmin:true},{new:true})
            expect(admin.isAdmin).toBeTruthy()

            response = await loginExec()
            expect(response.status).toBe(200);

            token = response.body['x-auth-token'];
            response = await getUserByIdExec(admin._id)

            expect(response.body).toHaveProperty("username")
            expect(response.body).toHaveProperty("isAdmin")
            expect(response.body).toHaveProperty("_id")
            expect(response.body).toHaveProperty("tags")
            expect(response.body).not.toHaveProperty("password")
        })
    })

    describe("  api/user/:id (delete) admin can delete a user ", () => {
    })

    describe("  api/user/me (get) user can get it's properties with given id gathered from 'x-auth-token'", () => {
        it("it should return 401 if x-auth-token is undefined", async ()=>{
            body = {}
            token = ""
            response = await getMyInfoExec()
            expect(response.status).toBe(401);
        })
        it("it should return 404 if user not found", async ()=>{
            body = {
                username: "erfanSeidipoor",
                password: "123456",
            }
            const user = await UserModel(body);
            token = user.generateAuthToken()

            response = await getMyInfoExec()
            expect(response.status).toBe(404);

        })
        it("it should return 200 && it should return user with given 'id' gathered from 'x-auth-token' && it should return object that containe 'username', 'tags', 'id' and 'isAdmin' and doesn't have 'password'", async ()=>{
            body = {
                username: "erfanSeidipoor",
                password: "123456",
            }
            const user = await UserModel(body).save();
            token = user.generateAuthToken()

            response = await getMyInfoExec()
            expect(response.status).toBe(200);
        })
    })


    describe("  api/user/me (delete) user can delete itslef", () => {

    })

    // it('Should Return 401 if client is not logged in', async ()=>{
        
    //     body = {
    //         movie: movieId,
    //         customer: customerId,
    //     }
    //     token = ''
    //     response = await exec()
    //     expect(response.status).toBe(401)
    // })

    // it('should return 400 if customerId or movieId  in not provided', async ()=>{

    //     body = {}
    //     response = await exec()
    //     expect(response.status).toBe(400)

    //     body = {customer: customerId}
    //     response = await exec()
    //     expect(response.status).toBe(400)

    //     body = {movie: movieId}
    //     response = await exec()
    //     expect(response.status).toBe(400)
    // })

    // it('should return 404 if no rental already processed', async ()=>{
     
    //     body = {
    //         movie: movieId,
    //         customer: mongoose.Types.ObjectId(),
    //     }
    //     response = await exec()
    //     expect(response.status).toBe(404)

    //     body = {
    //         movie: mongoose.Types.ObjectId(),
    //         customer: customerId,
    //     }
    //     response = await exec()
    //     expect(response.status).toBe(404)
    // })

    // it('should return 400 if rental already processed', async ()=>{

    //     rental.dateReturned = new Date();
    //     await rental.save();
    //     body = {
    //         movie: movieId,
    //         customer:  customerId,
    //     }
    //     response = await exec()
    //     expect(response.status).toBe(400)
        


    //     const processedRental = new RentalModel({
    //         customer: {
    //             _id: mongoose.Types.ObjectId(),
    //             name: '123456',
    //             phone: '1234567',
    //         },
    //         movie: {
    //             _id: mongoose.Types.ObjectId(),
    //             title: '12345',
    //             dailyRentalRate: 100,
    //         },
    //         dateReturned: new Date(),
    //     })
    //     await processedRental.save()

    //     body = {
    //         movie: processedRental.movie._id,
    //         customer:  processedRental.customer._id,
    //     }
    //     response = await exec()
    //     expect(response.status).toBe(400)
    // })
    
    // it('should return 200 if valid request', async ()=>{
    //     rental.dateOut = moment().add(-7, 'days').toDate()
    //     await rental.save()

    //     body = {
    //         movie: movieId,
    //         customer:  customerId,
    //     }
    //     response = await exec()
    //     expect(response.status).toBe(200)
    //     expect(response.body.dateReturned).not.toBeNull()

    //     const result = await RentalModel.findById(rental._id)
    //     expect(result.dateReturned).toBeDefined() 
    //     expect(result.rentalFee).toBeDefined()

    //     const movie_ = await MovieModel.findById(movieId)
    //     expect(movie.numberInStock - movie_.numberInStock).toBe(1)
    // })

    // it('should return rental if input is valid and should be equal with rental recored in DB', async ()=>{
    //     body = {
    //         movie: movieId,
    //         customer:  customerId,
    //     }
    //     response = await exec()
    //     expect(response)


    //     const rentalInDB = await RentalModel.findById(rental._id)

    //     expect(response.body).toHaveProperty('dateOut')
    //     expect(response.body).toHaveProperty('dateReturned')
    //     expect(response.body).toHaveProperty('rentalFee')
    //     expect(response.body).toHaveProperty('customer')
    //     expect(response.body).toHaveProperty('movie')
    // })
})
