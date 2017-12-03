// keys.js - Determines which credentials to return - either production or development
if (process.env.NODE_ENV === 'production') {
    // We are in production so return the prod keys
    module.exports = require('./prod');
} else {
    // We are in development so return the development keys
    module.exports = require('./dev');
}