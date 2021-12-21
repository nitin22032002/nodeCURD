const {Schema,model}=require("mongoose")

const taskSchema=new Schema({
    "userid":{
        type:Schema.Types.ObjectId,
        required:true,
    },
    "task":{
        type:String,
        required:true
    },
    "tag":{
        type:String,
        default:"Personal"
    },
    "status":{
        type:Number,
        required:true,
        default:1
    },
    "date":{
        type:Date,
        default:Date.now
    }
})

const Task=model("usertask",taskSchema)
Task.createIndexes()
module.exports=Task;