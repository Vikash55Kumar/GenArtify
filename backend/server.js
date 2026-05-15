import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/db.js';
import userRouter from './routers/user.router.js';
import imageRouter from './routers/image.route.js';
import path from 'path'
import cookieParser from 'cookie-parser'
import { phylaco } from '@phylaco/node'
import rateLimit from 'express-rate-limit'

const PORT = process.env.PORT;
const app = express()

phylaco.init(app, {
  ingestUrl: process.env.PHYLACO_INGEST_URL,
  projectKey: process.env.PHYLACO_PROJECT_KEY,
  serviceName: process.env.PHYLACO_SERVICE_NAME || "my-backend",
  debug: process.env.PHYLACO_DEBUG === "true",
});

// Add performance optimizations
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())
app.use(cors({
    origin: [process.env.CORES_ORIGIN || "https://genartify.vikashkr.online"],
    methods: 'DELETE, POST, GET, PUT',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-phylaco-trace-id'], 
    credentials: true,
}))

await connectDB()

// Add rate limiting
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api', limiter);

// Add caching for static files
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

export default app;
