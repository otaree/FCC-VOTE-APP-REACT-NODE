const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        trim: true,
        validate: {
            validator: value => validator.isEmail(value),
            message: '{value} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ["name", "email", "_id"]);
}

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = "access";

    const token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET);

    user.tokens = [...user.tokens, { access, token }];

    return user
            .save()
            .then(() => token);
}

UserSchema.methods.removeToken = function (token) {
    const user = this;
    
    return user
            .update({
                $pull: {
                    tokens: { token }
                }
            });
}

UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject();
    }

    return User
            .findOne({
                "_id": decoded._id,
                "tokens.access": decoded.access,
                "tokens.token": token
            });
}

UserSchema.statics.findByCredential = function (email, password) {
    const User = this;

    return User
            .findOne({ email })
            .then(user => {
                if (!user) {
                    return Promise.reject();
                }

                return new Promise((resolve, reject) => {
                    bcrypt.compare(password, user.password, (err, res) => {
                        if (res) {
                            resolve(user);
                        }
                        reject();
                    });
                });
            });
} 

UserSchema.pre("save", function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };