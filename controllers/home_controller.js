const Post = require('../models/post');


module.exports.home = function(request, respond){

    // Populate the user for each Post
    Post.find().populate('user').exec(function(err,posts){
        return respond.render('home', {
            title: "home",
            posts: posts
        });
    });
    // console.log(request.cookie);
    // respond.cookie('user_id', 25);

    // Post.find({}, function(err,posts){
    //     return respond.render('home', {
    //         title: "home",
    //         posts: posts
    //     });
    // });


    


    // return respond.end('<h1>Express is up for Codeal!</h1>');
}






//module.exports.actionName = function(request, respond){}