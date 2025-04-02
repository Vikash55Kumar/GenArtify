import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/db.js';
import userRouter from './routers/user.router.js';
import imageRouter from './routers/image.route.js';
import path from 'path'
import cookieParser from 'cookie-parser'

const PORT=process.env.PORT;
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    // origin: "http://localhost:5173",
    origin: [process.env.CORES_ORIGIN || "https://genartify.ecovix.online"],
    methods: 'DELETE, POST, GET, PUT',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'], 
    credentials: true,
}))

await  connectDB()

app.use('/api/v1/users', userRouter)
app.use('/api/v1/image', imageRouter)

app.get('/', (req, res) => res.send('API Working'))

const __dirname = path.resolve();
const buildPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(buildPath, {
    maxAge: '1d',
    etag: false,
}));

// Fallback to index.html for frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
