const authRoute = require("express").Router();
const User = require("../models/userModel")
const {info,err}=require("../utils/logger");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

authRoute.route("/login").post(login)
authRoute.route("/signup").post(signup)
authRoute.route("/varify").post(signup)

async function varify(){
    
}
async function login(req,res){
    info("Login",req.body)
    const findUser = await User.findOne({name:req.body.name})
    if(!findUser) {
        res.json({
            error:true,
            message:"User Not Found!"
        })
        return
    }
    console.log(findUser)
    const passMatch = await bcrypt.compare(req.body.pass,findUser.password)
    if(!passMatch){
        res.json({
            error:true,
            message:"Wrong Password"
        })
        return
    }
    // const expiry = req.body.keep && "10000d"
    const token = jwt.sign({
        id:findUser.id,
        name:findUser.name,
        password:findUser.password
    }, process.env.SECRET)

    res.json({
        error:false,
        message:"Logging in",
        token,
        user:{
            name:findUser.name,
            id:findUser._id
        }
    })
}
async function signup(req,res){
    info("Signup",req.body)
    try{
        info("Log Salt",process.env.CRYPTSALT)
        const bcryptedPassword = await bcrypt.hash(req.body.pass,(process.env.CRYPTSALT-1))    
        const newUser = new User({
            name:req.body.name,
            password:bcryptedPassword
        })
        await newUser.save()
        res.json({
            error:false,
            message:"Signing in"
        })
    }catch(error){
        err(error)
        res.json({
            error:true,
            message:error.message
        })
    }
}

module.exports = authRoute