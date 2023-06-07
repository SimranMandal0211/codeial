const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(request, respond){
    let post = await Post.findById(request.body.post);
         
    if(post){
        Comment.create({
            content: request.body.content,
            post: request.body.post,
            user:request.user._id
        },function(err, comment){
         // handle error
            post.comments.push(comment);
            post.save();
 
            request.flash('success', 'Added Comment!');
            respond.redirect('/');
        });
    }
}

module.exports.destroy = function(request, respond){
    Comment.findById(request.params.id, function(err, comment){
        if(comment.user == request.user.id){
            let postId = comment.post;
            comment.remove();

            Post.findByIdAndUpdate(postId, { $pull : {comments: request.params.id}}, function(err, post){
                request.flash('success', 'Comment deleted');
                return respond.redirect('back');
            })
        }else{
            request.flash('error', 'You can not delete this comment!');
            return respond.redirect('back');
        }
    });
}