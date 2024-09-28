const Post = require('../models/post');
const Comment = require('../models/comment');  
const Like = require('../models/like');

module.exports.create = async function(request, respond){
    
    try{    
        let post = await Post.create({
            content: request.body.content,
            user: request.user._id
        });
        if(request.xhr){
            post = await post.populate('user', 'name avatar');
            return respond.status(200).json({
                data: {
                    post: post
                },
                message: "Post created !"
            });
        }
        request.flash('success', 'Post published!');
        return respond.redirect('back');
    }catch(err){
        request.flash('err', err);
        return respond.redirect('back');
    }
}

module.exports.destroy =  async function(request, respond){
    try{
        let post = await Post.findById(request.params.id);

        // .id means converting the object id into string
        if(post.user == request.user.id){

            // Deleting all likes associated with the post
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            // await Like.deleteMany({_id: {$in: post.comments}});

            // find all comment associated with the post
            console.log('deleting posts comment like----->', request.params);
            let comments = await Comment.find({ post: request.params.id});
            // delete all the likes associated with each comment
            for (let comment of comments) {
                await Like.deleteMany({ likeable: comment._id,onModel: 'Comment' });
            }

            // Delete all comments related to the post
            await Comment.deleteMany({post: request.params.id});

            // Delete the post itself
            post.remove();
            
            if(request.xhr){
                return respond.status(200).json({
                    data: {
                        post_id: request.params.id
                    },
                    message: "Post deleted !"
                });
            }

            request.flash('success', 'Post and associated comments deleted');
            return respond.redirect('back');
        }else{
            request.flash('error', 'You can not delete this post!');
            return respond.redirect('back');
        }
    }catch(err){
        request.flash('err', err);
        return respond.redirect('back');
    }

}