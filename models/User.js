const {Schema,model}=require("mongoose")
 
const userSchema=new Schema({
    "name":{
        type:String,
        required:true
    },
    "emailid":{
        type:String,
        unique:true,
        required:true
    },
    "password":{
       type:String,
       required:true 
    },
    "dateofjoin":{
        type:Date,
        default:Date.now
    }
})
const user=model("Users",userSchema)
user.createIndexes()
module.exports=user;