import express from 'express';
import { signin, signup, google } from '../controllers/auth.controller.js';

const router = express.Router();

// Route for user registration
router.post('/signup', signup);

// Route for user login
router.post('/signin', signin);

// Route for Google authentication
router.post('/google', google);

export default router;
