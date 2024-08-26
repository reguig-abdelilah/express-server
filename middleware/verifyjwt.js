const jwt = require('jsonwebtoken');
require('dotenv').config();
const VerifyJWT = async (req, res, next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader) {
        res.sendStatus(401)
    }
    else{
        if(!authHeader.startsWith('Bearer ')) res.sendStatus(401);
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
            if(err) res.sendStatus(403); // Invalid Token
            else{
                req.user = decoded.userInfo.userName;
                req.roles = decoded.userInfo.userRoles;
                next();
            }
        })
    }

}

module.exports = VerifyJWT;