import express from 'express';
import * as quoteContoller from '../controllers/quoteController.js';

const router=express.Router();
router.post('/createQuote',quoteContoller.createQuote);

export default router;