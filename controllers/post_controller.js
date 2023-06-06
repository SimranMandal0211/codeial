const Post = require('../models/post');
const Comment = require('../models/comment');  

module.exports.create = async function(request, respond){
    
    try{    
        await Post.create({
            content: request.body.content,
            user: request.user._id
        })
        return respond.redirect('back');
    }catch(err){
        console.log('Error', err);
    }
}

module.exports.destroy =  async function(request, respond){
    try{
        let post = await Post.findById(request.params.id);

        // .id means converting the object id into string
        if(post.user == request.user.id){
            post.remove();
            await Comment.deleteMany({post: request.param.id});
            
            return respond.redirect('back');
            
        }else{
            return respond.redirect('back');
        }
    }catch(err){
        console.log('Error', err);
    }

}