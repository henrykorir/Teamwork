import { Router } from 'express';

import auth from '../middlewares/auth';
import multer from '../middlewares/multer-config';

import { 
	postGif, 
	getGifById, 
	getPublicId, 
	deleteGifById, 
	postCommentByGifId 
} from '../controllers/gifs';

const router = Router();

router.post('/gifs', auth,multer, postGif);
router.get('/gifs/:gifId',auth,getGifById);
router.delete('/gifs/:gifId',auth,getPublicId,deleteGifById);
router.post('/gifs/:gifId/comment',auth, postCommentByGifId);


export default router;