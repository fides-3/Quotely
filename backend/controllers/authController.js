import User from  '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const register=async(requestAnimationFrame,res)=>{
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
                details:validationErrors
            });
            
        }
        res.status(500).json({
            error:"Regiatrtion failed",
            details:error.message
        });
    }
}