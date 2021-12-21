const mongoose=require("mongoose")
const env=require("../env")
const connectionUrl=env.DB_URL
const connectDb=()=>{
        mongoose.connect(connectionUrl,(err)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log("Connected with Databse...")
            }
        })
}

module.exports=connectDb;