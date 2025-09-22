const express=require('express');
const router=express.Router();
import *  as authContoller from '../controllers/authController.js';
import {verifyToken} from '../middleware/verifyToken.js'

router.post("/register",authContoller.register);

export default router;