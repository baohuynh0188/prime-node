import express from 'express';
import { createPost, getPosts } from '../controllers/feed';

const router = express.Router();

// GET: /feed/posts
router.get('/posts', getPosts);

// POST: /feed/post
router.post('/post', createPost);

export default router;
