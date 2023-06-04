const Post = require('../models/post');
const Comment = require('../models/comment');  

module.exports.create = function(request, respond){
    Post.create({
        content: request.body.content,
        user: request.user._id
    }, function(err, post){
        if(err){    console.log('err in creating a Post');  return; }
        return respond.redirect('back');
    });
}

module.exports.destroy = function(request, respond){
    Post.findById(request.params.id, function(err, post){
        // .id means converting the object id into string
        if(post.user == request.user.id){
            post.remove();
            Comment.deleteMany({post: request.param.id}, function(err){
                return respond.redirect('back');
            });
        }else{
            return respond.redirect('back');
        }
    });
}