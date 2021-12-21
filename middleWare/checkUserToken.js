const {Strategy,ExtractJwt}=require("passport-jwt")
const user=require("../models/User")
const SecretKey=require("../env").SecretKey

const AuthenticateUser=(passport)=>{
    passport.use(new Strategy({
        secretOrKey:SecretKey,
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
    },function(userData,done){
        user.findOne({_id:userData.data},(err,data)=>{
            if(err){
                return done(err,false)
            }
            else if(data){
                return done(null,data)
            }
            else{
                return done(null,false)
            }
        })
    }))
}

module.exports=AuthenticateUser;