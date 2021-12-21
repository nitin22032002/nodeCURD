const task=require("../models/Task")

const checkTask=(req,res,next)=>{
    try{
        if(req.statusCode===401){
            return res.status(401).json({status:false,error:"not valid"})
        }
        else{
            let userid=req.user._id
            let taskid=req.params.id
            task.findOne({userid,_id:taskid},(error,data)=>{
                if(error || !data){
                    return res.status(404).json({status:false,error:"Not Found"})
                }
                else{
                    next()
                }
            })
        }
    }
    catch(error){
        return res.status(500).json({"status":false,error})
    }
}

module.exports=checkTask;