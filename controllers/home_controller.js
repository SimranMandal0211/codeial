const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(request, respond){
    // console.log(req.cookies);
    // res.cookie('user_id', 25);

    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title: "Codeial | Home",
    //         posts:  posts


    //     });
    // });

    // populate the user of each post
    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            // populate: { //for comment
            //     path: 'likes'
            // }
        }).populate({
            path: 'comments',
            populate: {
                path: 'likes'
            },
        })
        // .populate('comments')
        .populate('likes');   //for post

        // console.log('qqqq',posts[0].comments);
        
        let users = await User.find({})
        .populate('friendships');

        return respond.render('home', {
            title: "Codeial | Home",
            posts:  posts,
            all_users: users,
            // friends: friends
        });
    }catch(err){
        console.log('Error', err);
    }
}

// module.exports.actionName = function(req, res){}

// using then
// Post.find({}).populate('comments').then(function());

// let posts = Post.find({}).populate('comments').exec();

// posts.then()