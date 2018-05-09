require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

const { mongoose } = require('./db/mongoose');
const { User } = require('./models/User');
const { Poll } = require('./models/Poll');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
// configure CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth");
    res.header("Access-Control-Expose-Headers", "x-auth");
    next();
});


app.post('/poll', authenticate, async (req, res) => {
    const user = req.user;
    const body = _.pick(req.body, ["question", "options"]);
    body.author = user._id;

   
    const newPoll = new Poll(body);

    try {
        const poll = await newPoll.save();
        res.send(poll);
    } catch (e) {
        res.status(400).send();
    }
});

app.get('/polls', async (req, res) => {
    try {
        const polls = await Poll.find({});
        res.send(polls);
    } catch (e) {
        res.status(400).send();
    }
});

app.get('/poll/:id',  async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send();
    }

    try {
         const poll = await Poll.findById(id);
         if (!poll) {
             throw "No Poll"
         }
         res.send(poll);
    } catch (e) {
        res.status(400).send();
    }
});


app.patch('/poll/:id/vote', async (req, res) => {
    const id = req.params.id;
    const optionId = req.body.option;
    const userId = req.body.userId;

    if (!ObjectId.isValid(id) || !ObjectId.isValid(optionId)) {
        return res.status(400).send();
    }

    try {
        const poll = await Poll.findOne({ _id: id, "voters.voter": userId });
        if (poll) throw "User already Voted";
        const updatedPoll = await Poll.findOneAndUpdate({ _id: id, "options._id": optionId }, { $inc: { 'options.$.votes': 1 }, $push: { voters: { voter: userId } } }, { new: true });
        if (!updatedPoll) throw "Invalid Id";
        res.send(updatedPoll);
    } catch (e) {
        res.status(400).send();
    }
});


app.patch('/poll/:id', authenticate, async (req, res) => {
    const user = req.user;
    const id = req.params.id;
    const newOptions = req.body.add || null;
    const removeOptions = req.body.remove || null;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send();
    }

    try {
        let updatedPoll;
        if (newOptions) {
            updatedPoll = await Poll.findOneAndUpdate({ _id: id, author: user._id }, { $push: { options: { $each: newOptions } } }, { new: true });
        }
        if (removeOptions) {
            updatedPoll = await Poll.findOneAndUpdate({ _id: id, author: user._id }, { $pull: { options: { $or: removeOptions } } }, { new: true });            
        }
        if (!updatedPoll) throw "No Poll";
        res.send(updatedPoll);
    } catch (e) {
        res.status(400).send();
    }
});



app.post('/user', async (req, res) => {
    const body = _.pick(req.body, ["name", "email", "password"]);

    const newUser = new User(body);

    try {
        const token = await newUser.generateAuthToken();
        const user = _.pick(newUser, ["name", "email", "_id"]);
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    }

});

app.post('/user/login', async (req, res) => {
    const body = _.pick(req.body, ["email", "password"]);

    try {
        const user = await User.findByCredential(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    }

});

app.get('/user/token', async (req, res) => {
    const token = req.headers['x-auth'];


    try {
        const user = await User.findByToken(token);
        if (!user) {
            throw "No User";
        }
        res.send(user);
    } catch (e) {
        res.status(400).send();
    }
});

app.delete('/user/logout', authenticate, async (req, res) => {
    const token = req.token;
    const user = req.user;

    try {
        await user.removeToken(token);
        res.send(); 
    } catch (e) {
        res.status(400).send();
    }
});

app.patch('/user/password/change', authenticate, async (req, res) => {
    const token = req.token;
    const user = req.user;
    const newPassword = req.body.password;
    user.password = newPassword;

    try {
        const updatedUser = await user.save();
        res.send(updatedUser) 
        if (!updatedUser) {
            throw "DID NOT UPDATE";
        }
        res.send(updatedUser);
    } catch (e) {
        res.status(400).send();
    }
});


app.listen(port, () => {
    console.log(`server is up at port ${port}`);
});

module.exports = { app };

