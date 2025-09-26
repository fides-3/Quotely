import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js';
// import {verifyToken} from '../middleware/verifyToken.js'

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

export default router;