import express from 'express';
import dotenv from 'dotenv';
import connectDb from './database/db.js';
import userroutes from './routes/userroutes.js';
import airoutes from './routes/airoutes.js';
import boardroutes from './routes/boardroutes.js';
import pinroutes from './routes/pinroutes.js';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// ✅ Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.Cloud_name,
  api_secret: process.env.Cloud_secret,
  api_key: process.env.Cloud_api,
});

const app = express();

// ✅ Middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// ✅ API Routes
app.use('/api/user', userroutes);
app.use('/api/pins', pinroutes);
app.use('/api/boards', boardroutes);
app.use('/api/ai', airoutes);

// ✅ Serve Frontend (production)
const frontendPath = path.join(__dirname,"../Frontend/dist");
app.use(express.static(frontendPath));

// ⚡️ Express 5-safe wildcard route (fixes your crash)
app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "../Frontend/dist", "index.html"));
  });

// ✅ Start Server + Connect DB
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  await connectDb();
});
