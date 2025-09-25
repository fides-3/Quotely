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