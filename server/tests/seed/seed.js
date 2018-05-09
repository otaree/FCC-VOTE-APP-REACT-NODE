const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { User } = require('../../models/User');
const { Poll } = require('../../models/Poll');

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
};

const polls = [{
    _id: mongoose.Types.ObjectId(),
    question: "who won the race?",
    author: userOneId,
    options: [
        {
            value: "Rabbit"
        },
        {
            value: "Turtle"
        }
    ]
}, {
    _id: mongoose.Types.ObjectId(),
    question:"why did the chicken cross the road?",
    author: userTwoId,
    voters: [{ voter: userTwoId }],
    options: [
        {
            votes: 1,
            value: "she wanted to",
            _id: mongoose.Types.ObjectId()
        },
        {
            votes: 0,
            value: "there was a cock on the other side",
            _id: mongoose.Types.ObjectId()
        }
    ]
}];

const populatePolls = done => {
    Poll.remove({})
        .then(() => {
            return Poll.insertMany(polls);
        })
        .then(() => done());
};

module.exports = { users, populateUsers, polls, populatePolls, userOneId, userTwoId };