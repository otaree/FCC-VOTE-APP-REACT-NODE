require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { User } = require('./models/User');
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

