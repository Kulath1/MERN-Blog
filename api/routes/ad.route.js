import express from 'express';
import {verifyToken} from '../utils/verifyUser.js'
import { createAd } from '../controllers/ad.controller.js';
import { updateAd } from '../controllers/ad.controller.js';

const router = express.Router();

router.post('/create',verifyToken, createAd);
router.put('/updateAd/:adId', verifyToken, updateAd);
//router.delete('/deleteAd/:adId', verifyToken, deleteAd)

export default router;