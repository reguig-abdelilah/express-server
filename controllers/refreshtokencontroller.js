const userSchema = require('../schemas/userschema.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const HandleRefreshToken = async (req, res)=>{
    const cookies = req.cookies;
    if(!cookies?.jwt) res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const foundUser = await userSchema.FindByToken(refreshToken);
    console.log("refreshing !!!!!!");
    if(foundUser === null)
        res.sendStatus(403);
    else{
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err,decoded)=>{
            if(err || foundUser.userName !== decoded.username) res.sendStatus(403);

            const userRoles = foundUser.roles;
            const accessToken = jwt.sign(
                {
                    userInfo: {
                        userName: foundUser.userName,
                        userRoles: userRoles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'1d'}
            )
            
            foundUser.accessToken = accessToken;
            await foundUser.save();
            res.json({success:true, accessToken:accessToken});
        })
    }
};
module.exports = HandleRefreshToken;