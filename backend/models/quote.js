import mongoose from 'mongoose'

const quoteSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
        trim:true
    },
    author:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    likeCount:{
        type:Number,
        default:0
    },
    comments:[{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        content:{
            type:String,
            required:true,
            trim:true
        },
        createdAt:{
            type:Date,
            default:Date.now
        },
        updatedAt:{
            type:Date
        }
    }]
}, { 
    timestamps:true 
})
export default mongoose.model("Quote",quoteSchema)