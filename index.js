const express = require('express');

// Setup for cookie
const cookieParser = require('cookie-parser');

const app = express();
const port = 8000;


// set up the layouts
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

// setup database
const db = require('./config/mongoose');
app.use(express.urlencoded()); //add body-parser

// cookie
app.use(cookieParser());

// use assets like css js and images
app.use(express.static('./assets'));


// extract style and script from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// use express router
app.use('/', require('./routes'));


app.listen(port, function(err){
    if(err){
        console.log(`Error is running the server: ${err}`);
    }

    console.log(`Server is running in port: ${port}`);
});