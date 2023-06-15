const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(request, respond){

    try{
        let post = await Post.findById(request.body.post);

        if (post){
            let comment = await Comment.create({
                content: request.body.content,
                post: request.body.post,
                user: request.user._id
            });

            post.comments.push(comment);
            post.save();

            if (request.xhr){
                // Similar for comments to fetch the user's id!
                comment = await comment.populate('user', 'name').execPopulate();   //??
    
                return respond.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }

            request.flash('success', 'Comment published!');
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

        if (comment.user == request.user.id){
            let postId = comment.post;
            comment.remove();
            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: request.params.id}});

            // send the comment id which was deleted back to the views
            if (request.xhr){
                return respond.status(200).json({
                    data: {
                        comment_id: request.params.id
                    },
                    message: "comment deleted"
                });
            }


            request.flash('success', 'Comment deleted!');
            return respond.redirect('back');
        }else{
            request.flash('error', 'Unauthorized');
            return respond.redirect('back');
        }
    }catch(err){
        request.flash('error', err);
        return;
    }
}