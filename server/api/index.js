import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from '../utils/connectDB.js';
import cookieParser from 'cookie-parser';
import authRoutes from '../routes/authRoutes.js';
import userActivityRoutes from '../routes/userActivityRoutes.js';
import tvShowRoutes from '../routes/tvShowRoutes.js';
import movieRoutes from '../routes/movieRoutes.js';
import multiRoutes from '../routes/multiRoutes.js';
import mediaRoutes from '../routes/mediaRoutes.js';
import recommendationRoutes from '../routes/recommendationRoutes.js';

// Initialize the express application
const app = express();

// Middleware setup
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Error while connecting to DB', err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activity', userActivityRoutes);
app.use('/api/tv', tvShowRoutes);
app.use('/api/movie', movieRoutes);
app.use('/api/multi', multiRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/ideas', recommendationRoutes);

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8800;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
