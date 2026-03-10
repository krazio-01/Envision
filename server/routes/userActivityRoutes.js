import express from 'express';
import authMiddleware from '../middlewares/authMiddlerware.js';
import {
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    markAsCompleted,
    markAsDropped,
} from '../controllers/userActivityController.js';

const router = express.Router();

// add bookmark endpoint
router.get('/fetchBookmarks', authMiddleware, fetchBookmarks);

// add bookmark endpoint
router.post('/addBookmark', authMiddleware, addBookmark);

// add bookmark endpoint
router.post('/removeBookmark', authMiddleware, removeBookmark);

// mark show as completed
router.post('/markCompleted', authMiddleware, markAsCompleted);

// mark show as dropped
router.post('/markDropped', authMiddleware, markAsDropped);

export default router;
