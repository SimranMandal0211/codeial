const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: '/images/default-image/default-1b78d46e4e.jpg'
    },
    friendships: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friendship' 
        }
    ]
},{
        timestamps:true
});

let storage = multer.diskStorage({
    destination: function(request, file, cb){
        cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function(request, file, cb){
        cb(null, file.fieldname + '-' + Date.now());    // file.fieldname = avatar
    }
});

// static methods
userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;


const User = mongoose.model('User', userSchema);

module.exports = User;