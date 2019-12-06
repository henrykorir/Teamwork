import  Router from 'express';
import  signin from '../controllers/signin';

const router = Router();

router.post('/auth/signin',signin);

export default router;