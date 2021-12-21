const express=require("express")
const router=express.Router()
const {body,validationResult}=require("express-validator")
const task=require("../models/Task")
const authenticateUserToken=require("../middleWare/checkUserToken")
const passport=require("passport")
const checkTask=require("../middleWare/checkUser")
authenticateUserToken(passport)

router.get("/",(req,res)=>{
    try{
        return res.status(200).render("HomePage")
    }
    catch(error){
        console.log(error)
        return res.status(500).render("Server Error.......")
    }
})

router.get("/getalltask",passport.authenticate("jwt",{session:false}),(req,res)=>{
   try{
        if(req.statusCode===401){
            return res.status(401).json({"status":false,error:"not valid"})
        }
        else{
            let userid=req.user._id
            task.find({userid},(error,data)=>{
                if(error){
                    console.log(error)
                    throw(error)
                }
                else{
                    return res.status(200).json({status:true,task:data})
                }
            })
        }
   }
   catch(error){
       return res.status(500).json({status:false,error})
   }
})

router.post("/addtask",passport.authenticate("jwt",{session:false}),
    [
        body("task").isLength({min:5,max:1000})
    ]
    ,(req,res)=>{
    try{
        let error=validationResult(req)
        if(error.isEmpty()){
        if(req.statusCode===401){
            return res.status(401).json({status:false,error:"not valid"})
        }
        else{
            req.body.userid=req.user._id
            req.body.status=parseInt(req.body.status)
            task.create(req.body,(error,data)=>{
                if(error){
                    throw(error)
                }
                else{
                    return res.status(200).json({status:true,task:data})
                }
            })
        }}
        else{
            return res.status(500).json({status:false,error:error.errors})
        }
    }
    catch(error){
        console.log(error)
        return res.status(500).json({status:false,error})
    }
})

router.put("/updatetask/:id",passport.authenticate("jwt",{session:false}),
    [
        body("task").isLength({min:5,max:1000})
    ]
    ,checkTask,(req,res)=>{
    try{
        let error=validationResult(req)
        if(error.isEmpty()){
        let taskid=req.params.id;
        task.findByIdAndUpdate({_id:taskid},req.body,(error,data)=>{
            if(error){
                return res.status(500).json({status:false,error})
            }
            else{
                return res.status(200).json({status:true,data:req.body})
            }
        })
    }
    else{
        return res.status(500).json({status:false,error:error.errors})
    }
}
    catch(error){
        console.log(error)
        return res.status(500).json({status:false,error})
    }

})

router.delete("/deletetask/:id",passport.authenticate("jwt",{session:false}),checkTask,(req,res)=>{

    try{
        let taskid=req.params.id;
        task.findByIdAndDelete({_id:taskid},(error,data)=>{
            if(error){
                return res.status(500).json({status:false,error})
            }
            else{
                return res.status(200).json({status:true,error})
            }
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({status:false,error})
    }   
})

module.exports=router;