const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(request, respond){

    try{
        let post = await Post.findById(request.body.post);
         
        if(post){
            let comment = await Comment.create({
                content: request.body.content,
                post: request.body.post,
                user:request.user._id
            });

            post.comments.push(comment);
            post.save();
 
            request.flash('success', 'Added Comment!');
            respond.redirect('/');
        }
    }catch(err){
        request.flash('error', err);
        return;
    }
    
}

module.exports.destroy = async function(request, respond){
    try{
        let comment = await Comment.findById(request.params.id);
        if(comment.user == request.user.id){
            let postId = comment.post;
            comment.remove();

            let post = await Post.findByIdAndUpdate(postId, { $pull : {comments: request.params.id}});
            
            // send the comment id which was deleted back to the views
            if(request.xhr){
                return respond.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Comment deleted"
                });
            }

            request.flash('success', 'Your Comment deleted');
            return respond.redirect('back');

        }else{
            request.flash('error', 'You can not delete this comment!');
            return respond.redirect('back');
        }
    }catch(err){
        request.flash('error', err);
        return respond.redirect('back');
    }
}