import mongoose from 'mongoose'

const quoteSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
        trim:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
}, { 
    timestamps:true 
})
export default mongoose.model("Quote",quoteSchema)