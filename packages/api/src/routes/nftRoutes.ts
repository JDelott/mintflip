import express from 'express';
import { addMusicNFT, getMusicNFTs, getUserTracks } from '../controllers/nftController';

const router = express.Router();

router.post('/music', addMusicNFT);
router.get('/music', getMusicNFTs);
router.get('/music/user/:address', getUserTracks);

export default router;
