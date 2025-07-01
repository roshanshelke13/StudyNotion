const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const crypto = require("crypto")

exports.resetPasswordToken = async(req,res) => {
    try {
        // Extract email from request body
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(402).json({ success: false, message: "User not found" });
        }

        // Generate a reset token with JWT (expires in 15 minutes)
        const resetToken = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "15m" }
        );

        // Construct reset URL
        const resetURL = `http://localhost:3000/update-password/${resetToken}`;

        // Send email with reset link
        await mailSender(
            email, 
            "Password Reset Request", 
            `Click the following link to reset your password: ${resetURL}`
        );

        return res.status(200).json({
            success: true,
            message: "Password reset link sent successfully",
            resetToken,
            resetURL
        });

    } catch (error) {
        console.error("Error sending password reset email:", error);
        console.log("error here")
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}

exports.resetPassword = async(req,res) => {
    try{
        const {token,password,confirmPassword} = req.body; 

        if(!token){
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        let decoded;
        try{
            decoded = jwt.verify(token,process.env.JWT_SECRET);
        }catch (error) {
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }

        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if(password !== confirmPassword){
            return res.status(404).json({ success: false, message: "password not matching" });
        }

        const hashedPassword = await bcrypt.hash(password,10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successful" });

    }catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

