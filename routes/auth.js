const express = require('express');
const router = express.Router();
const User=require("../models/User")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")

const {body,validationResult}=require("express-validator")
// api to render registration page
let SecretKey=require("../env").SecretKey


router.get("/register",(req,res,next)=>{
  try{
      return res.status(200).render("registrationPage")
  }
  catch(e){
    return res.status(500).json({msg:"Server Error...."})
  }
})

router.get("/login",(req,res,next)=>{
  try{
    let msg=req.query.msg
    msg=msg===undefined?"":msg
    return res.status(200).render("loginPage",{msg})
  }
  catch(e){
    return res.status(500).json({"msg":"Server Error...."})
  }
}) 

router.post("/adduser",
            [body("emailid","Invalid Email Id").isEmail(),
            body("name","Invalid Name Format").isAlpha().isLength({min:2,max:20}),
            body("password","Password Must Greater then 8 and less then 24").isLength({min:8,max:24})
            ]
            ,(req,res)=>{
    try{
      let error=validationResult(req)
      if(error.isEmpty()){
          let salt=bcrypt.genSaltSync()
          req.body.password=bcrypt.hashSync(req.body.password,salt)
          User.create(req.body).then(
          (data)=>{
            let token=jwt.sign({data:data._id},SecretKey)
            return res.status(200).json({status:true,token})
          }).catch((error)=>{
            return res.status(500).json({status:false,error:"This Email Id Already Exist"})
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

router.post("/checkuser",
            [body("emailid","Invalid Email Id").isEmail(),
            body("password","Password Must Greater then 8 and less then 24").isLength({min:8,max:24})
            ]
            ,(req,res)=>{
    try{
      let error=validationResult(req)
      if(error.isEmpty()){
          User.findOne({emailid:req.body.emailid}).then(
          (data)=>{
            if(bcrypt.compareSync(req.body.password,data.password)){
            let token=jwt.sign({data:data._id},SecretKey)
            return res.status(200).json({status:true,token})}
            else{
              return res.status(401).json({status:false,"msg":"Email Id and Password Not Valid"})
            }
          }).catch((error)=>{
            console.log(error)
            return res.status(500).json({status:false,error})
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


module.exports = router;


