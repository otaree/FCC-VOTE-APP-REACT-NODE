const request = require('supertest');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');

const { app } = require('../server');
const { User } = require('../models/User');
const { Poll } = require('../models/Poll');
const { users, populateUsers, polls, populatePolls, userOneId, userTwoId, userOneUid, userTwoUid } = require('./seed/seed');

describe('SERVER', function () {
    this.timeout(15000);
    beforeEach(populateUsers);
    beforeEach(populatePolls);

    describe('POST /poll', () => {
        it('should create a new poll', done => {
            const token = users[0].tokens[0].token;
            const question = "New Poll";
            const options = [{
                value: "Yes"
            }, {
                value: "No"
            }];

            request(app)
                .post('/poll')
                .set("x-auth", token)
                .send({ question, options })
                .expect(200)
                .expect(res => {
                    expect(res.body.question).to.equal(question);
                    expect(res.body.options[0].value).to.equal(options[0].value);
                })
                .end((err, res) => {
                    if (err) return done(err);
                    Poll.find({})
                        .then(polls => {
                            expect(polls.length).to.equal(3);
                            done()
                        })
                        .catch(e => done(e));
                });
        });

        it('should not create a new poll for invalid user', done => {
            const token = "123abc"
            const question = "New Poll";
            const options = [{
                value: "Yes"
            }, {
                value: "No"
            }];

            request(app)
                .post('/poll')
                .set("x-auth", token)
                .send({ question, options })
                .expect(401)
                .end(done);
        });

        it('should not create a new poll for invalid poll data', done => {
            const token = users[0].tokens[0].token;

            request(app)
                .post('/poll')
                .set("x-auth", token)
                .send({ })
                .expect(400)
                .end(done);
        });
    });

    describe('GET /polls', () => {
        it('should return all polls', done => {
            request(app)
                .get('/polls')
                .expect(200)
                .expect(res => {
                    expect(res.body.length).to.equal(2);
                    expect(res.body[0].author._id).to.equal(userOneId.toHexString());
                })
                .end(done);
        });
    });

    describe('GET /polls/user', () => {
        it('should return all polls by a user', done => {
            const token = users[1].tokens[0].token;

            request(app)
                .get('/polls/user')
                .set('x-auth', token)
                .expect(200)
                .expect(res => {
                    expect(res.body.length).to.equal(1);
                    expect(res.body[0]._id).to.equal(polls[1]._id.toHexString());
                })
                .end(done);
        });
    });

    describe('GET /poll/:id', () => {
        it('should return a poll', done => {
            const id = polls[0]._id.toHexString();
            
            request(app)
                .get(`/poll/${id}`)
                .expect(200)
                .expect(res => {
                    expect(res.body.question).to.equal(polls[0].question)
                })
                .end(done);
        });

        it('should not return a poll for invalid id', done => {
            const id = mongoose.Types.ObjectId().toHexString();
            
            request(app)
                .get(`/poll/${id}`)
                .expect(400)
                .end(done);
        });
    });

    describe('PATCH /poll/:id/vote', () => {
        it('should be able to cast vote for first time voter', done => {
            const uid = userOneUid;
            const option = polls[1].options[0]._id.toHexString();
            const id = polls[1]._id.toHexString();

            request(app)
                .patch(`/poll/${id}/vote`)
                .send({ uid, option })
                .expect(200)
                .expect(res => {
                    expect(res.body.options[0].votes).to.equal(2);
                })
                .end((err, res) => {
                    if (err) return done(err);
                    Poll.findById(id)
                        .then(poll => {
                            expect(poll.options[0].votes).to.equal(2);
                            done();
                        })
                        .catch(e => done(e));
                });
        });

        it('should not be able to cast vote for user who already casted vote a poll', done => {
            const uid = userTwoUid;
            const option = polls[1].options[0]._id.toHexString();
            const id = polls[1]._id.toHexString();

            request(app)
                .patch(`/poll/${id}/vote`)
                .send({ uid, option })
                .expect(400)
                .end((err, res) => {
                    if (err) return done(err);
                    Poll.findById(id)
                        .then(poll => {
                            expect(poll.options[0].votes).to.equal(1);
                            done();
                        })
                        .catch(e => done(e));
                });
        });

        it('should not be able to cast vote for invalid option id', done => {
            const uid = uniqid();
            const option = mongoose.Types.ObjectId().toHexString()
            const id = polls[1]._id.toHexString();

            request(app)
                .patch(`/poll/${id}/vote`)
                .send({ uid, option })
                .expect(400)
                .end(done);
        });
    });

    describe('PATCH /poll/:id', () => {
        it('should update a poll', done => {
            const token = users[1].tokens[0].token;
            const id = polls[1]._id.toHexString();
            const add = [{ value: "No reason" }];
            const remove = [polls[1].options[1]];

            request(app)
                .patch(`/poll/${id}`)
                .set('x-auth', token)
                .send({ add, remove })
                .expect(200)
                .expect(res => {
                    expect(res.body.options.length).to.equal(2);
                    expect(res.body.options[1].value).to.equal(add[0].value);
                })
                .end((err, res) => {
                    if (err) return done(err);
                    Poll.findById(id)
                        .then(poll => {
                            expect(poll.options[1].value).to.equal(add[0].value);
                            done();
                        })
                        .catch(e => done(e));
                });
        });

        it('should add options of a poll ', done => {
            const token = users[1].tokens[0].token;
            const id = polls[1]._id.toHexString();
            const add = [{ value: "No reason" }];

            request(app)
                .patch(`/poll/${id}`)
                .set('x-auth', token)
                .send({ add })
                .expect(200)
                .expect(res => {
                    expect(res.body.options.length).to.equal(3);
                    expect(res.body.options[2].value).to.equal(add[0].value);
                })
                .end((err, res) => {
                    if (err) return done(err);
                    Poll.findById(id)
                        .then(poll => {
                            expect(poll.options.length).to.equal(3);
                            done();
                        })
                        .catch(e => done(e));
                });
        });

        it('should remove options of a poll ', done => {
            const token = users[1].tokens[0].token;
            const id = polls[1]._id.toHexString();
            const remove = [polls[1].options[1]];

            request(app)
                .patch(`/poll/${id}`)
                .set('x-auth', token)
                .send({ remove })
                .expect(200)
                .expect(res => {
                    expect(res.body.options.length).to.equal(1);
                })
                .end((err, res) => {
                    if (err) return done(err);
                    Poll.findById(id)
                        .then(poll => {
                            expect(poll.options.length).to.equal(1);
                            done();
                        })
                        .catch(e => done(e));
                });
        });

        it('should not update a poll', done => {
            const token = users[1].tokens[0].token;
            const id = polls[1]._id.toHexString();

            request(app)
                .patch(`/poll/${id}`)
                .set('x-auth', token)
                .send({  })
                .expect(400)
                .end(done)
        });
    });

    describe('DELETE /poll/:id', () => {
        it('should delete a poll', done => {
            const token = users[1].tokens[0].token;
            const id = polls[1]._id.toHexString();

            request(app)
                .delete(`/poll/${id}`)
                .set('x-auth', token)
                .expect(200)
                .expect(res => {
                    expect(res.body.question).to.equal(polls[1].question);
                })
                .end((err, res) => {
                    if (err) return done(err);

                    Poll.find()
                        .then(polls => {
                            expect(polls.length).to.equal(1);
                            done();
                        })
                        .catch(e => done(e));
                });
        });

        it('should not delete a poll of invalid user', done => {
            const token = users[0].tokens[0].token;
            const id = polls[1]._id.toHexString();

            request(app)
                .delete(`/poll/${id}`)
                .set('x-auth', token)
                .expect(400)
                .end(done);
        });

        it('should not delete a poll of invalid poll id', done => {
            const token = users[0].tokens[0].token;
            const id = mongoose.Types.ObjectId().toHexString();

            request(app)
                .delete(`/poll/${id}`)
                .set('x-auth', token)
                .expect(400)
                .end(done);
        });
    });

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