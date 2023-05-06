const express = require('express');
const app = express();
const port = 8000;


// set up the layouts
const expressLayouts = require('express-ejs-layouts');

// use assets like css js and images
app.use(express.static('./assets'));

app.use(expressLayouts);

// setup database
const db = require('./config/mongoose');


// extract style and script from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




// use express router
app.use('/', require('./routes'));


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.listen(port, function(err){
    if(err){
        console.log(`Error is running the server: ${err}`);
    }

    console.log(`Server is running in port: ${port}`);
});