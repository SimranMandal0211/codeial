const mongoose = require('mongoose');
// const env = require('../config/environment');

const dotenv = require('dotenv');
dotenv.config();

mongoose.set('strictQuery', true); 

// mongoose.connect(`mongodb://0.0.0.0/${env.db}`);
mongoose.connect(process.env.MONGODB_CONNECT_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000,
    tls: true
});

// mongoose.connect(`mongodb://0.0.0.0/${env.db}`);

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error connecting to mongodb"));

db.once('open', function(){
    console.log('connected to database:: MongoDB');
});

module.exports = db;