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
    
    // if(request.cookies.user_id){
    //     User.findById(request.cookies.user_id, function(err, user){
    //         if(err){ console.log('err in finding user in profile'); return; }
    //         if(user){
    //             return respond.render('user_profile', {
    //                 title: "User profile",
    //                 user: user
    //             })
    //         }
    //         else{
    //             return respond.redirect('/users/sign-in');
    //         }
    //     });
    // }
    // else{
    //     return respond.redirect('/users/sign-in');
    // }
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
                avatar: '/public/assets/images/default-image/default-1b78d46e4e.jpg' // Default avatar
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

// -----same as above but due to callback in Model.findOne() this showing error. so we used promises to solve this issue---------------
    // User.findOne({email: request.body.email}, function(err, user){
    //     if(err){    console.log('error in finding in signing up');  return; }

    //     if(!user){
    //         User.create(request.body, function(err, user){
    //             if(err){    console.log('error in creating user while signing up');
    //                 return}

    //             return respond.redirect('/users/sign-in');
    //         })
    //     }else{  //if user already exist we send back to sign-in page
    //         return respond.redirect('back');
    //     }
    // });
}

// get the signIn data
module.exports.createSession = function(request, respond){
    // -------------Manual-----------------
    // steps to authenticate
    // Find user found

    // User.findOne({email: request.body.email}, function(err, user){
    //     if(err){    console.log('error in finding in signing in');  return; }

    //     // handle user found
    //     if(user){
    //         // handle password which don't match 
    //         if(user.password != request.body.password){
    //             return respond.redirect('back');
    //         }
    //         // handle session creation
    //         respond.cookie('user_id', user.id);
    //         return respond.redirect('/users/profile');
    //     }
    //     else{
    //         // handle user not found
    //         return respond.redirect('back');
    //     }

    // });
    // -------------------------------------

// Using Passport
   
    request.flash('success', 'Logged in Successfully');
    return respond.redirect('/');
}

// --------------Manual Authentication -----------------
// module.exports.signOut = function(request, respond){
//     // return respond.end('<h1>Sign-Out!! Congo You did it very well!! </h1>');

//     respond.clearCookie('user_id');
//     console.log("cookie clear");
//     return respond.render('user_sign_out',{
//         title: "Codeial | Sign Out"
//     })
// }
// ---------------------------------------------------

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
                let user = await User.findByIdAndUpdate(request.params.id);
                User.uploadedAvatar(request, respond, function(err){
                    if(err) {console.log('******Multer Error', err)}
    

                    // console.log(request.file);
                    // without body we can't read this bcoz its multi part
                    user.name = request.body.name;
                    user.email = request.body.email;
    
                    if(request.file){

                        if(user.avatar){
                            // fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                            fs.existsSync(path.join(__dirname, '..',user.avatar));
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
        // find posts by the user
        const userPosts = await Post.find({ user: userId });

        // delete likes on user's post
        for(let post of userPosts){
            await Like.deleteMany({ likeable: post._id, onModel: 'Post' });

            // Find comments on the post (made by any user)
            const postComments = await Comment.find({ post: post._id });

            // Delete likes on the comments associated with the post
            for(let comment of postComments){
                await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });

                comment.remove();
            }

            // Delete all comments on the post (made by any user)
            await Comment.deleteMany({ post: post._id });
          
            post.remove();
            console.log('Deleted user\'s Post.');
        }

        // Delete all comments made by the user on other's post
        await Comment.deleteMany({ user: userId });
        console.log('Deleted user\'s comments. ');

        // Delete all likes made by the user........
        await Like.deleteMany({ user: userId });
        console.log('Deleted user\'s own likes. ');

        // Remove User A from friendships
        // Find friendships to delete
        const friendshipsToDelete = await Friendship.find({
            $or: [{ from_user: userId }, { to_user: userId }]
        });
        
        // Check if any friendships are found
        if (friendshipsToDelete.length > 0) {
            // Extract the friendship IDs from the documents
            const friendshipIdsToDelete = friendshipsToDelete.map(friendship => friendship._id);

            // Find users that have these friendships
            const usersWithFriendships = await User.find({ friendships: { $in: friendshipIdsToDelete } });
            
            // Loop through users and remove the friendships from their friendships array
            for (const user of usersWithFriendships) {
                user.friendships.pull(...friendshipIdsToDelete); // Spread the IDs for pulling
                await user.save(); // Save the updated user document
            }

            // Delete the friendships after removing from users
            await Friendship.deleteMany({ _id: { $in: friendshipIdsToDelete } });
            console.log('Delete user\'s friend');
        }


        // .....Delete the user account.....
        await User.findByIdAndDelete(userId);
        console.log('User account deleted successfully');

        // Logout and redirect
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