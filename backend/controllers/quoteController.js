import Quote from "../models/quote.js";
import mongoose from "mongoose";

export const createQuote= async (req,res)=>{
    const {content,author}=req.body;
    const userId = req.user.id; // Get user ID from authenticated request
    
    if(!content || !author) {
        return res.status(400).json({error:"Content and Author are required"})
    }
    
    try{
        const newQuote=await Quote.create({
            content,
            author,
            userId
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
};

export const getUserQuotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const quotes = await Quote.find({ userId })
            .populate('likes', 'username')
            .populate('comments.userId', 'username')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: quotes,
            count: quotes.length
        });
    } catch (error) {
        console.error('Get User Quotes Error:', error);
        res.status(500).json({
            error: 'Failed to fetch quotes',
            details: error.message
        });
    }
};

// Get quotes by specific user ID (for public profiles)
export const getQuotesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const quotes = await Quote.find({ userId })
            .populate('likes', 'username')
            .populate('comments.userId', 'username')
            .populate('userId', 'username')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: quotes,
            count: quotes.length
        });
    } catch (error) {
        console.error('Get Quotes By User ID Error:', error);
        res.status(500).json({
            error: 'Failed to fetch user quotes',
            details: error.message
        });
    }
};

// Like/unlike a quote
export const toggleLikeQuote = async (req, res) => {
    try {
        const { quoteId } = req.params;
        const userId = req.user.id;
        
        const quote = await Quote.findById(quoteId);
        if (!quote) {
            return res.status(404).json({
                error: 'Quote not found'
            });
        }
        
        const hasLiked = quote.likes.includes(userId);
        
        if (hasLiked) {
            // Unlike
            quote.likes.pull(userId);
            quote.likeCount = Math.max(0, quote.likeCount - 1);
        } else {
            // Like
            quote.likes.push(userId);
            quote.likeCount += 1;
        }
        
        await quote.save();
        
        res.json({
            success: true,
            message: hasLiked ? 'Quote unliked' : 'Quote liked',
            likeCount: quote.likeCount,
            hasLiked: !hasLiked
        });
    } catch (error) {
        console.error('Toggle Like Quote Error:', error);
        res.status(500).json({
            error: 'Failed to toggle like',
            details: error.message
        });
    }
};

// Add comment to a quote
export const addComment = async (req, res) => {
    try {
        const { quoteId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                error: 'Comment content is required'
            });
        }
        
        const quote = await Quote.findById(quoteId);
        if (!quote) {
            return res.status(404).json({
                error: 'Quote not found'
            });
        }
        
        const newComment = {
            userId,
            content: content.trim(),
            createdAt: new Date()
        };
        
        quote.comments.push(newComment);
        await quote.save();
        
        // Populate the new comment with user info
        const populatedQuote = await Quote.findById(quoteId)
            .populate('comments.userId', 'username');
        
        const addedComment = populatedQuote.comments[populatedQuote.comments.length - 1];
        
        res.json({
            success: true,
            message: 'Comment added successfully',
            comment: addedComment
        });
    } catch (error) {
        console.error('Add Comment Error:', error);
        res.status(500).json({
            error: 'Failed to add comment',
            details: error.message
        });
    }
};

// Edit a comment
export const editComment = async (req, res) => {
    try {
        const { quoteId, commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                error: 'Comment content is required'
            });
        }
        
        const quote = await Quote.findById(quoteId);
        if (!quote) {
            return res.status(404).json({
                error: 'Quote not found'
            });
        }
        
        const comment = quote.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found'
            });
        }
        
        // Check if user owns the comment
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({
                error: 'You can only edit your own comments'
            });
        }
        
        comment.content = content.trim();
        comment.updatedAt = new Date();
        
        await quote.save();
        
        // Populate the updated comment with user info
        const populatedQuote = await Quote.findById(quoteId)
            .populate('comments.userId', 'username');
        
        const updatedComment = populatedQuote.comments.id(commentId);
        
        res.json({
            success: true,
            message: 'Comment updated successfully',
            comment: updatedComment
        });
    } catch (error) {
        console.error('Edit Comment Error:', error);
        res.status(500).json({
            error: 'Failed to edit comment',
            details: error.message
        });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { quoteId, commentId } = req.params;
        const userId = req.user.id;
        
        const quote = await Quote.findById(quoteId);
        if (!quote) {
            return res.status(404).json({
                error: 'Quote not found'
            });
        }
        
        const comment = quote.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found'
            });
        }
        
        // Check if user owns the comment or the quote
        if (comment.userId.toString() !== userId && quote.userId.toString() !== userId) {
            return res.status(403).json({
                error: 'You can only delete your own comments or comments on your quotes'
            });
        }
        
        quote.comments.pull(commentId);
        await quote.save();
        
        res.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Delete Comment Error:', error);
        res.status(500).json({
            error: 'Failed to delete comment',
            details: error.message
        });
    }
};

// Get total likes for a user (across all their quotes)
export const getUserTotalLikes = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const result = await Quote.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, totalLikes: { $sum: '$likeCount' } } }
        ]);
        
        const totalLikes = result.length > 0 ? result[0].totalLikes : 0;
        
        res.json({
            success: true,
            totalLikes
        });
    } catch (error) {
        console.error('Get User Total Likes Error:', error);
        res.status(500).json({
            error: 'Failed to get total likes',
            details: error.message
        });
    }
};