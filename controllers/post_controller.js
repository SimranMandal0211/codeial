const Post = require('../models/post');
const Comment = require('../models/comment');  

module.exports.create = async function(request, respond){
    
    try{    
        await Post.create({
            content: request.body.content,
            user: request.user._id
        })
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
            post.remove();
            await Comment.deleteMany({post: request.param.id});
            
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