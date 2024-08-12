const mongooose = require('mongoose')

const UserSchema =  new mongooose.Schema({
    userName: 
    {
        type: String,
        required:true,
        lowercase:true
    },
    email: 
    {
        type: String,
        required:true,
        lowercase:true,
        unique:true

    },
    passwordHash:  {
        type: String,
        required:true,
    },
    verified:{
        type:Boolean,
        required:true,
    },
    verificationCode:{
        type:String,
    },
    refreshToken:  {
        type: String,
        // required:true,
    },
    roles: {
        type:[Number],
        require:true
    },
    // walletAddress:{
    //     type:[String],
    // },
    // alertsSettings: {
    //     type: mongooose.SchemaTypes.ObjectId,
    // },
    // alertsCount:{
    //     type: Number,
    // },
    createdAt: {
        type: Date,
        immutable:true,
        default:() => Date.now(),
    },
    updatedAt:  {
        type: Date,
        default:() => Date.now(),
    },
})
UserSchema.statics.CheckEmailExists =async function(email){
    const res = await this.find({email : email})
    if(res.length === 0  ){
        return false
    }
    else{
        return true
    }
}
UserSchema.statics.VerifyUser =async function(verificationCode){
    const res = await this.find({verificationCode : verificationCode})
    if(res.length === 0  ){
        return {message:"Your account is already verified. No further action is needed."}
    }
    else{
        res[0].verificationCode = ''
        res[0].verified = true
        await res[0].save()
        return {message:"Congratulations! Your account is now verified and ready to use."}
    }
}
UserSchema.statics.FindByEmail =async function(email){
    const user = await this.findOne({email : email})
    return user
}
UserSchema.statics.FindByToken =async function(token){
    const user = await this.findOne({refreshToken : token})
    return user
}


module.exports = mongooose.model('User', UserSchema);