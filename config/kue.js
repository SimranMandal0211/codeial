const kue = require('kue');
const queue = kue.createQueue();

// var queue = kue.createQueue({
//     redis: {
//         port: 6379, // Redis port
//         host: '127.0.0.1', // Redis host
//         // Other Redis options if needed
//     }
// });

module.exports = queue;