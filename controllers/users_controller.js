const User = require('../models/user');
const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Friendship = require('../models/friendship');

const fs = require('fs');
const path = require('path');

module.exports.profile = function(request, respond){
    // return respond.end('<h1>User Profile</h1>');
    console.log('user detail---->', request.user);
    User.findById(request.params.id, function(err, user){
        return respond.render('user_profile', {
            title: "user_profile",
            profile_user: user
        });
    });
    
}

// render the sign up page
module.exports.signUp = function(request, respond){
    
    if(request.isAuthenticated()){
        return respond.redirect('/users/profile');
    }
    
    return respond.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}

// render the sign in page
module.exports.signIn = function(request, respond){

    if(request.isAuthenticated()){
        return respond.redirect('/users/profile');
    }

    return respond.render('user_sign_in',{
        title: "Codeial | Sign In"
    })
}


// get the signUp data
module.exports.create = function(request, respond){
    // first we check pswd & confirm pswd same or not
    if(request.body.password != request.body.confirm_password){
        return respond.redirect('back');
    }
    User.findOne({email: request.body.email}).then((user) => {

        if(!user){
            let userData = {
                ...request.body, // Copy all fields from request.body
                avatar: '/images/default-image/default-1b78d46e4e.jpg' // Default avatar
            };

            User.create(userData).then(() => {
                return respond.redirect('/users/sign-in');
            }).catch((err) => {
                console.log('error in creating user while signing up ',err);
                return respond.redirect('back');
            })
        }
        else{   //if user already exist we send back to sign-in page
            return respond.redirect('back');
        }
}).catch((err) => {
    console.log('error in finding in signing up', err);
})

}

// get the signIn data
module.exports.createSession = function(request, respond){
   
    request.flash('success', 'Logged in Successfully');
    return respond.redirect('/');
}


module.exports.destroySession = function(request, respond){
    request.logout(function(err) {
        if (err) { return next(err); }

        request.flash('success','You have Logged out!');
        respond.redirect('/');
      });
}

module.exports.update = async function(request, respond){
        if(request.user.id == request.params.id){

            try{
                let user = await User.findById(request.params.id);
                User.uploadedAvatar(request, respond, function(err){
                    if(err) {console.log('******Multer Error', err)}
    

                    // console.log(request.file);
                    // without body we can't read this bcoz its multi part
                    user.name = request.body.name;
                    user.email = request.body.email;
    
                    if(request.file){

                        if(user.avatar && !user.avatar.includes('default-image')){
                            const oldAvatarPath = path.join(__dirname, '..', user.avatar);
                           if(fs.existsSync(oldAvatarPath)){
                            fs.unlinkSync(oldAvatarPath);
                           }
                        }
                        // this is saving the path of the uploaded file into the avatar field in the user 
                        user.avatar = User.avatarPath + '/' + request.file.filename;
                    }
                    user.save();
                    return respond.redirect('back');
                });
            }catch(err){
                request.flash('error', err);
                return respond.redirect('back');
            }
        }
        else{
            request.flash('error', 'Unauthorized!');
            return respond.status(401).send('Unauthorized');
        }
    }

module.exports.deleteAccount = async function(request, respond){
    const userId = request.user._id;

    try{
        const userPosts = await Post.find({ user: userId });

        for(let post of userPosts){
            await Like.deleteMany({ likeable: post._id, onModel: 'Post' });

            const postComments = await Comment.find({ post: post._id });

            for(let comment of postComments){
                await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });
            }

            await Comment.deleteMany({ post: post._id });
        }

        await Post.deleteMany({ user: userId });
        console.log('Deleted user\'s posts.');

        await Comment.deleteMany({ user: userId });
        console.log('Deleted user\'s comments. ');

        await Like.deleteMany({ user: userId });
        console.log('Deleted user\'s own likes. ');

        const friendshipsToDelete = await Friendship.find({
            $or: [{ from_user: userId }, { to_user: userId }]
        });
        
        if (friendshipsToDelete.length > 0) {
            const friendshipIdsToDelete = friendshipsToDelete.map(friendship => friendship._id);

            const usersWithFriendships = await User.find({ friendships: { $in: friendshipIdsToDelete } });
            
            for (const user of usersWithFriendships) {
                user.friendships.pull(...friendshipIdsToDelete);
                await user.save();
            }

            await Friendship.deleteMany({ _id: { $in: friendshipIdsToDelete } });
            console.log('Deleted user\'s friendships');
        }

        await User.findByIdAndDelete(userId);
        console.log('User account deleted successfully');

        request.logout(function(err){
            if(err){
                console.log('Error logging out ',err);
            }
            return respond.redirect('/');
        });

    }catch(err) {
        console.log('Error in deleting user account', err);
        return respond.redirect('back');
    };
};