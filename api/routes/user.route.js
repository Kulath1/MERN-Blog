import express from 'express';
import { test, updateUser, deleteUser, signout } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId',verifyToken, updateUser);   // 'put' is used to update something
router.delete('/delete/:userId',verifyToken, deleteUser);
router.post('/signout', signout);

export default router;