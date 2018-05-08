const request = require('supertest');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { app } = require('../server');
const { User } = require('../models/User');
const { users, populateUsers } = require('./seed/seed');

describe('SERVER', function () {
    this.timeout(15000);
    beforeEach(populateUsers);

    describe('POST /user', () => {
        it('should create a new user', done => {
            const user = {
                name: "Joe",
                email: "joe@example.com",
                password: "password!"
            };

            request(app)
                .post('/user')
                .send(user)
                .expect(200)
                .expect(res => {
                    expect(res.headers['x-auth']).to.exist;
                    expect(res.body._id).to.exist;
                    expect(res.body).to.include({ email: user.email, name: user.name });
                })
                .end((err, res) => {
                    if (err) return done(err);

                    User
                        .find({})
                        .then(users => {
                            expect(users.length).to.equal(3);
                            done()
                        })
                        .catch(e => done(e));
                });
        });

        it('should not create a user for missing field', done => {
            const user = {
                email: 'joe@example.com',
                password: 'password!'
            };

            request(app)
                .post('/user')
                .send(user)
                .expect(400)
                .end(done);
        });

        it('should not create a user for invalid email', done => {
            const user = {
                name: "Joe",
                email: 'joe.com',
                password: 'password!'
            };

            request(app)
                .post('/user')
                .send(user)
                .expect(400)
                .end(done)
        });

        it('should not create a user for invalid password', done => {
            const user = {
                name: "Joe",
                email: 'joe@example.com',
                password: 'pas'
            };

            request(app)
                .post('/user')
                .send(user)
                .expect(400)
                .end(done)
        });
    });

    describe('POST /user/login', () => {
        it('should login a user', done => {
            const user = {
                email: users[0].email,
                password: users[0].password
            };

            request(app)
                .post('/user/login')
                .send(user)
                .expect(200)
                .expect(res => {
                    expect(res.headers['x-auth']).to.exist;
                    expect(res.body.email).to.equal(user.email);
                    expect(res.body._id).to.equal(users[0]._id.toHexString());
                })
                .end((err, res) => {
                    if (err) return done(err);

                    User
                        .findById(users[0]._id)
                        .then(user => {
                            expect(user.tokens.length).to.equal(2);
                            done();
                        })
                        .catch(e => done(e));
                });
        });

        it('should not login a user if invalid user', done => {
            const user = {
                email: 'joe@example.com',
                password: "adfadfafasf"
            };

            request(app)
                .post('/user/login')
                .send(user)
                .expect(400)
                .end(done);
        });
    });

    describe('GET /user/token', () => {
        it('should get user data for valid auth token', done => {
            const token = users[0].tokens[0].token;

            request(app)
                .get('/user/token')
                .set('x-auth', token)
                .expect(200)
                .expect(res => {
                    expect(res.body.email).to.equal(users[0].email);
                    expect(res.body.name).to.equal(users[0].name);
                    expect(res.body._id).to.equal(users[0]._id.toHexString());
                })
                .end(done);
        });

        it('should not get user data for invalid auth token', done => {
            const token = jwt.sign({ _id: users[0]._id, access: 'auth'}, "DAMN");

            request(app)
                .get('/user/token')
                .expect(400)
                .end(done);
        });
    });

    describe("DELETE /user/logout", () => {
        it("should logout a user", done => {
            const token = users[0].tokens[0].token;

            request(app)
                .delete('/user/logout')
                .set('x-auth', token)
                .expect(200)
                .end(done);
        });

        it('should not logout if invalid auth token', done => {
            const token = "dfafafafasdfasdf";

            request(app)
                .delete('/user/logout')
                .set('x-auth', token)
                .expect(401)
                .end(done);
        });
    });

    describe("PATCH /user/password/change", () => {
        it('should change a user password', done => {
            const token = users[0].tokens[0].token;
            const id = users[0]._id;

            User.findById(id)
                .then(user => {
                    const original_password = user.password;

                    request(app)
                        .patch('/user/password/change')
                        .send({ password: "somethingnew" })
                        .set('x-auth', token)
                        .expect(200)
                        .end((err, res) => {
                            if (err) return done(err);

                            User.findById(id)
                                .then(updatedUser => {
                                    expect(updatedUser.password).to.not.equal(original_password);
                                    done()
                                })
                                .catch(e => done(e));
                        });  
                })
                .catch(e => done(e));
        });
    });

});