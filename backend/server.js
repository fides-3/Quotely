const express=require('express');
import cors from 'cors';
import path from 'path';
import {corsOptions} from ".config/corsOptions.js";
import {connectDB} from './config/db.js';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRouts.js';
import dotenv from 'dotenv';

dotenv.config();

const app=express();
const PORT=process.env.PORT ||5000;
