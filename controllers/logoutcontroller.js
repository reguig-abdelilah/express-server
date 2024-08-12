const userSchema = require('../schemas/userschema.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const HandleLogOut = async (req, res)=>{
    // On client delete the accessToken
    const cookies = req.cookies;
    if(!cookies?.jwt) res.sendStatus(204); //Successful + No Content to Send
    const refreshToken = cookies.jwt;
    const foundUser = await userSchema.FindByToken(refreshToken);
    console.log("logging out !!!!!!");

    if(foundUser === null){
        res.clearCookie('jwt', {httpOnly:true, maxAge:24*60*60*1000} )
        res.sendStatus(204);
    }
    else{
        foundUser.refreshToken = '';
        await foundUser.save();
        res.clearCookie('jwt', {httpOnly:true, maxAge:24*60*60*1000} )
        res.sendStatus(204);
    }
};
module.exports = HandleLogOut;