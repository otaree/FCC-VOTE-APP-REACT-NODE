const { User } = require('../models/User');

const authenticate = async (req, res, next) => {
    const token = req.headers['x-auth'];
    
    try {
        const user = await User.findByToken(token);
        if (!user) {
            throw "No User";
        }
        req.user = user;
        req.token = token;
        next()
    } catch (e) {
        res.status(401).send();
    }
}

module.exports = { authenticate };