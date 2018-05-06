const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { User } = require('../../models/User');

const userOneId = mongoose.Types.ObjectId();
const userTwoId = mongoose.Types.ObjectId();


const users = [
    {
        _id: userOneId,
        name: "Test1",
        email: "test1@test.com",
        password: "password1",
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: userOneId.toHexString(), access: 'auth' }, process.env.JWT_SECRET)
            }
        ]
    }, {
        _id: userTwoId,
        name: "Test2",
        email: "test2@test.com",
        password: "password2",
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: userTwoId.toHexString(), access: 'auth' }, process.env.JWT_SECRET)
            }
        ]
    }
];

const populateUsers = done => {
    User
        .remove({})
        .then(() => {
            const userOne = new User(users[0]).save();
            const userTwo = new User(users[1]).save();

            return Promise.all([userOne, userTwo]);
        })
        .then(() => done());
}

module.exports = { users, populateUsers };