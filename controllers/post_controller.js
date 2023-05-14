const Post = require('../models/post');
module.exports.create = function(request, respond){
    Post.create({
        content: request.body.content,
        user:request.user._id
    }, function(err, post){
        if(err){
            console.log('err in creating a Post');
                return;
        }
        return respond.redirect('back');
    });
}