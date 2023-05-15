const comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(request, respond){
    Post.findById(request.body.post), function(err, post){
        if(post){
            Comment.create({
                content: request.body.content,
                post: request.body.post,
                user:request.user._id
            },
            function(err, comment){
                // handle error
                post.comment.push(comment);
                post.save();
            });
            respond.redirect('/');
        }
    }
}