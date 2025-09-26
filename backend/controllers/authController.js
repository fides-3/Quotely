import User from  '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const generateAccessToken=(user)=>{
    return jwt.sign({id:user._id},
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"15m",
        }
    )                                                                              
};

const generateRefreshToken=(user)=>{
    return crypto.randomBytes(64).toString('hex');
}

export const register=async(req,res)=>{
    const{username,email,password}=req.body;

    try{
        const existingUser=await User.findOne({
            $or:[{email},{username}]
        })
        if(existingUser){
            return res.status(409).json({
                error:existingUser.email===email?"Email already exists":"username already exists"
            });
        }

        const hashpword=await bcrypt.hash(password,10)
        const user=new User({
            username,
            email,
            password:hashpword
        });
        await user.save();
        res.status(200).json({
            message:'User Registered  successfully'
        });
    }catch(error){
        console.error('Registration error:',error);

        if(error.name==='ValidationError'){
            const ValidationErrors=Object.values(error.errors).map(err=>err.message);
            return res.status(400).json({
                error:'Validation error',
                details:ValidationErrors
            });
            
        }
        res.status(500).json({
            error:"Registrtion failed",
            details:error.message
        });
    }
}

export const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user || !(await bcrypt.compare(password,user.password)))
            return res.status(401).json({error:'Invalid Credentials'});

        const accessToken=generateAccessToken(user)
        const refreshToken =generateRefreshToken();
        user.refreshToken=refreshToken;

        await user.save();

        res.cookie("jwt",refreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:"Lax",
            maxAge:24*60*60*1000,
        }).json({accessToken});
    }catch(error){
        res.status(500).json({
            error:'Login failed',
            details:error.message,
        });
    }
}

export const refreshToken=async(req,res)=>{
    const cookies=req.cookies;
    if(!cookies?.jwt)
        return res.status(401).json({error:'No token'});
    const refreshToken=cookies.jwt;
    const user=await User.findOne({refreshToken});
    const accessToken=generateAccessToken(user);
    res.json({accessToken});
}

export const forgotPassword=async(req,res)=>{
    const{email}=req.body;
    try{
        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({error:'User with this email does not exist'});
        }
        const resetToken=crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry=Date.now() + 3600000

        await User.findByIdAndUpdate(user._id,{
            resetPasswordToken:resetToken,
            resetPasswordExpires:resetTokenExpiry
        });

        res.json ({
            success:true,
            message:'Password reset token generated',
            resetToken:resetToken
        });
        }catch(error){
            console.error('forgot Password error:',error);
            res.status(500).json({
                error:'Failed to process password reset request',
                details:error.message,
            });
        }
    }
export const resetPassword=async(req,res)=>{
    const{resetToken,newPassword}=req.body;
    try{
        const user=await User.findOne({
            resetPasswordToken:resetToken,
            resetPasswordExpires:{$gt:Date.now()}
        })

        if (!user){
            return res.status(400).json({error:'Invalid or expired reset token'});  
        }
        const hashedPwd=await bcrypt.hash(newPassword,10);

        await User.findByIdAndUpdate(user._id,{
            password:hashedPwd,
            $unset:{
                resetPasswordToken:1,
                resetPasswordExpires:1
            }
        });
        res.json({
            success:true,
            message:'apassword has been reset successfully'
        })
    }catch(error){
        console.error('Reset Password Error:',error);
        res.status(500).json(({
            error:'Failed to reset password',
            details:error.message,

        }))
    }
}