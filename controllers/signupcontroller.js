const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // For Hashing Passwords
const crypto = require('crypto'); // For generating Verification Code
const userSchema = require('../schemas/userschema.js');
const rolesList = require('../config/roleslist.js');
const sendMail = require('./mailingController');
mongoose.connect('mongodb://127.0.0.1:27017/app');

const HandleSignup = async (req, res)=>{
    const {userName, email, password} = req.body
    if(!userName || !email || !password) res.status(400).json({success: false, "message": "User-Name, email and password are required"});
    else if(!ValidateEmail(email)){ // Email Validation
        res.status(400).json({success:false, message:"Please enter a valid email address"})
    }
    else if(!ValidatePassword(password)){ // Password Validation
        res.status(400).json({success:false, message:"Password must be at least 8 characters long, contain at least one alphabetic character, one number, and one special character."})
    }
    else{
        try{
            const emailExist = await userSchema.CheckEmailExists(email) // Checking if the provided email already exists in the DB
            if(emailExist === false){
                const saltRounds = 10; // Hashing the password
                const passwordHash = await bcrypt.hash(password, saltRounds); // Hashing the password
                
                const verificationCode = crypto.randomBytes(32).toString('hex'); // Generating account verification code
                const verificationLink = `http://localhost:3000/verify?${verificationCode}`;
                await sendMail(
                    {
                        to:email,
                        subject:'Verify your email address',
                        text:`Please verify your emailss address by clicking the following link: ${verificationLink}`,
                        html:`<strong>Please verify your email address by clicking the following link: <a href="${verificationLink}">${verificationLink}</a></strong>`
                    });
    
                const newUser = new userSchema({ // Saving the User's data to the database
                    userName: userName,
                    email: email,
                    passwordHash: passwordHash,
                    verified:false,
                    verificationCode : verificationCode,
                    roles:[rolesList.USER]
                });
                await newUser.save(); // Finished Saving
                res.json( {success: true, message: ""});
            }else{
                res.status(409).json({success: false, message: "An Account With This Email Already Exists"});
            }
        }catch(e){
            res.status(500).json({success: false, message: "Signup Failed"});

        }
    }
};



function ValidateEmail(email) {
    // Define the regular expression for a valid email address
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Test the email against the regular expression
    return emailRegex.test(email);
}
function ValidatePassword(password) {
    // Define the regular expression for a valid password
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    
    // Test the password against the regular expression
    return passwordRegex.test(password);
}
module.exports = HandleSignup;