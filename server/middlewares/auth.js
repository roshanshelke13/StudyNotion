const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res,next) => {
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing"
            })
        }

        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error){
            console.log(error.message)
            return res.status(401).json({
                success:false, 
                message:"token is invalid",
            })
        }

        next();
    }
    catch(error){
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"something went wrong while validating"
        })
    }
};

exports.isStudent = (req,res,next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for students only"
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"something went wrong while validating"
        })
    }
};

exports.isInstructor = (req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for instructor only"
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"something went wrong while validating"
        })
    }
};

exports.isAdmin = (req,res,next) => {
    try{
        console.log("inside admin");
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"this is a protected route for Admin only"
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"something went wrong while validating"
        })
    }
}
