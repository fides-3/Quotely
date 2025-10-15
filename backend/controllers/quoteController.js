import Quote from "../models/quote.js";

export const createQuote= async (req,res)=>{
    const {content,author}=req.body;
    
    if(!content || !author) {
        return res.status(400).json({error:"Content and Author are required"})

    }
    try{
        const newQuote=await Quote.create({
            content,
            author
        });
        res.status(201).json({
            success:true,
            message:'Quote created successfully',
            data:newQuote
        });
    }catch(error){
        console.error('Create Quote Error:',error);
        res.status(500).json({
            error:'Failed to create quote',
            details:error.message
        });
    }   
}