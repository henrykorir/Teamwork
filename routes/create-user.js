import Router from 'express';
import createUser from '../controllers/create-user';

const router = Router();

router.post('/auth/create-user',createUser);

export default router;