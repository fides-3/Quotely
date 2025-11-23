import express from 'express';
import * as quoteContoller from '../controllers/quoteController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router=express.Router();
router.post('/createQuote', verifyToken, quoteContoller.createQuote);
router.get('/my-quotes', verifyToken, quoteContoller.getUserQuotes);
router.get('/user/:userId', quoteContoller.getQuotesByUserId);
router.post('/:quoteId/like', verifyToken, quoteContoller.toggleLikeQuote);
router.post('/:quoteId/comment', verifyToken, quoteContoller.addComment);
router.get('/total-likes', verifyToken, quoteContoller.getUserTotalLikes);

export default router;