import express from 'express';
import {verifyToken} from '../utils/verifyUser.js'
import { create, deletepost, updatepost } from '../controllers/post.controller.js';
import { getposts } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getposts', getposts) // no need to verify tokens as any user can search for a post
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost);
router.put('/updatepost/:postId/:userId', verifyToken, updatepost);

export default router;