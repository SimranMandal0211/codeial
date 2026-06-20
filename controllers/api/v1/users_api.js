const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');
const bcrypt = require('bcrypt'); 

module.exports.createSession = async function(request, respond){

    try{
        let user = await User.findOne({email: request.body.email});
        if (!user) {
            return respond.json(422, { message: "Invalid username or password" });
        }
        let isMatch = await bcrypt.compare(request.body.password, user.password);
        if (!isMatch) {
            return respond.json(422, { message: "Invalid username or password" });
        }

        return respond.json(200, {
            message: 'Sign in successful, here is your token, Please keep it safe!',
            data: {
                token: jwt.sign(user.toJSON(), env.jwt_secret , {expiresIn: '100000'})
            }
        })

    }catch(err){
        console.log('*****', err);
        return respond.json(500, {
            message: "Internal Server Error"
        });
    }
   
}