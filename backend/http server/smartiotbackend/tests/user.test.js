
const request = require('supertest');
const {app, conn} = require('../app.js');

var random_username = 'max'+Math.floor(Math.random() * 1000)
var session_id;

describe('API testing - user', () => {
    it('service up?', (done) => {
        request(app)
        .get('/sensor_api_user')
        .expect(200)
        .end((err, res) => {
            expect(res.body.running).toBe(true)
            done();
        })
    })
    it('register user', (done) => {
        request(app)
        .post('/sensor_api_user/register_user')
        .send({username: random_username,password:'musterpasswort'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body.msg).toBe("sucessfully added user")
            done();
        })
    })
    it('login', (done) => {
        request(app)
        .post('/sensor_api_user/login')
        .send({username: random_username,password:'musterpasswort'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body.error).toBe(undefined)
            session_id = res.body.msg
            done();
        })
    })
    it('register device', (done) => {
        request(app)
        .post('/sensor_api_user/register_device')
        .send({device_hash: helper.generateSeed(),session_id: session_id})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body.msg).toBe("sucessfully added device")
            done();
        })
    })
    it('post data', (done) => {
        request(app)
        .post('/sensor_api/post_data')
        .send({device_hash: "37922a4f24debc9d285359edb373d1c46ba03927ed628386b469cce7232b98f5",co2:"0.5",temp:25,pressure:0.3,humidity:0.66,iaq:450}) // device_id from sensor, just an example here
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body.error).toBe(undefined)
            done();
        })
    })
    it('fetch data', (done) => {
        request(app)
        .post('/sensor_api_user/get_data')
        .send({session_id: session_id}) // session_id from login
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body.error).toBe(undefined)
            done();
        })
    })

    it('fetch stats', (done) => {
        request(app)
        .post('/sensor_api_user/get_stats')
        .send(
            {
                session_id: "8383ac6ab372349e80f6c9317f50eecdcbc03b4f585f51adf2510106b04fc08f",
                device_hash:"b29f63636a8d56a4dbaa9123ff7afe8cb601c1104d40f34c1a3226b572b60341",
                "time_range": 2592000 //one month time range

            }) // session_id from login
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body.error).toBe(undefined)
            done();
        })
    })

    it('get devices for user', (done) => {
        request(app)
        .post('/sensor_api_user/get_devices')
        .send({session_id: "8383ac6ab372349e80f6c9317f50eecdcbc03b4f585f51adf2510106b04fc08f",}) // session_id from login
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body.error).toBe(undefined)
            done();
        })
    })

    it('change device name', (done) => {
        request(app)
        .post('/sensor_api_user/update_device_name')
        .send(
        {
            session_id: "8383ac6ab372349e80f6c9317f50eecdcbc03b4f585f51adf2510106b04fc08f",
            device_hash:"b29f63636a8d56a4dbaa9123ff7afe8cb601c1104d40f34c1a3226b572b60341",
            device_name: "test update" 

        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body.error).toBe(undefined)
            done();
        })
    })

    it('get ampel value', (done) => {
        request(app)
        .post('/sensor_api_user/get_ampel_values')
        .send(
        {
            session_id: "8383ac6ab372349e80f6c9317f50eecdcbc03b4f585f51adf2510106b04fc08f",
            device_hash:"b29f63636a8d56a4dbaa9123ff7afe8cb601c1104d40f34c1a3226b572b60341",

        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body.error).toBe(undefined)
            done();
        })
    })
})


