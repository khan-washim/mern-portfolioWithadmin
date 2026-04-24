import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/error.js';

// Routes
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import projectRoutes from './routes/projects.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Database Connection ──
connectDB();

// ── Middleware ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Dynamic CORS Configuration ──
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:5173',
  process.env.CLIENT_URL // Deploy korle .env theke live URL nibe
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Rate Limiting ──
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // General limit barano hoyeche
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes); // Limiter route file-e apply kora bhalo
app.use('/api/projects', projectRoutes);

// Health check & Home Route
app.get('/', (req, res) => {
  res.send('🚀 Portfolio API is running...');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    env: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
  });
});

// ── 404 & Error Handling ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

// ── Server Listen ──
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 API Base: http://localhost:${PORT}/api\n`);
});

// Handle Unhandled Rejections (Production security)
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});