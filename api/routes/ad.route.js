import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createAd, getAds, deleteAd, updateAd, displayAd} from '../controllers/ad.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createAd);
router.get('/getads', verifyToken, getAds);
router.delete('/delete/:adId/:userId', verifyToken, deleteAd);
router.put('/update/:adId/:userId', verifyToken, updateAd);
router.get('/display', displayAd);

export default router;