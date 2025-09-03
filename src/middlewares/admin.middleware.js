const ApiError = require('../utils/ApiError');

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        throw new ApiError(403, 'Forbidden: Access is restricted to administrators.');
    }
};

module.exports = isAdmin;