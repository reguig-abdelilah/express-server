const express = require('express');
const handleSignup = require('../../controllers/signupcontroller'); 
const handleSignin = require('../../controllers/signincontroller'); 
const handleRefreshToken = require('../../controllers/refreshtokencontroller'); 
const handleLogOut = require('../../controllers/logoutcontroller'); 
router = express.Router();

router.post('/signup',handleSignup)
router.post('/signin',handleSignin)
router.get('/refresh',handleRefreshToken);
router.get('/logout',handleLogOut)
router.post('/request-reset-pwd',(req,res)=>{
    
})
router.post('/reset-pwd',(req,res)=>{
    
})
router.post('/delete',(req,res)=>{
    
})
module.exports = router;