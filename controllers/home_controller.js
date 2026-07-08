const Friendship = require('../models/friendship');
const Post = require('../models/post');
const User = require('../models/user');
const moment = require('moment');


module.exports.home = async function(request, respond){
    
    try{

        const loggedInUserId = request.user ? request.user.id : null;

        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: { path: 'user' },
        }).populate({
            path: 'comments',
            populate: { path: 'likes' },
        })
        .populate('likes');

        posts = posts.map(post => {
            post.relativeTime = moment(post.createdAt).fromNow();
            post.comments = post.comments.map(comment => {
                comment.relativeTime = moment(comment.createdAt).fromNow();
                return comment;
            });
            return post;
        });
        
        let users = await User.find({})

        let friendlist = [];
        if(loggedInUserId){
            friendlist = await Friendship.find({
                $or: [{ from_user: loggedInUserId }, { to_user: loggedInUserId }]
            })
            .populate('from_user')
            .populate('to_user');

            friendlist = friendlist.map(f => {
                f.friend = f.from_user._id.equals(loggedInUserId) ? f.to_user : f.from_user;
                return f;
            });
        }

        return respond.render('home', {
            title: "Codeial | Home",
            posts:  posts,
            all_users: users,
            all_friends: friendlist
        });
    }catch(err){
        console.log('Error', err);
        return respond.redirect('back');
    }
}