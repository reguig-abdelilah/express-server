const userSchema = require('../schemas/userschema.js');
const bcrypt = require('bcrypt'); // For Hashing Passwords
const jwt = require('jsonwebtoken');
require('dotenv').config();
const HandleSignin = async (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password) res.status(400).json({success:false, message:"Email & Password are required"});
    const foundUser = await userSchema.FindByEmail(email)
    if(foundUser === null)
        res.status(401).json({success:false, message:" There is no active account with the provided credentials "})
    else{
        const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
        if(isMatch === true){
            const userRoles = foundUser.roles;
            const accessToken = jwt.sign(
                {
                    userInfo: {
                        userName: foundUser.userName,
                        userRoles: userRoles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'10s'}
            )
            const refreshToken = jwt.sign(
                {username:foundUser.userName},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn:'1d'}
            )
            foundUser.refreshToken = refreshToken
            await foundUser.save()
            res.cookie('jwt', refreshToken, {httpOnly:true, maxAge:24*60*60*1000} )
            res.json({success:true, accessToken:accessToken, roles: userRoles})


            
        }
        else{
            res.status(401).json({success:false, message:" There is no active account with the provided credentials "})
        }
    }
};
module.exports = HandleSignin;