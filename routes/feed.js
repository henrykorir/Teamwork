import Router from'express';

import auth from '../middlewares/auth';
import getFeed from '../controllers/feed';

const router = Router();

router.get('/feed',auth,getFeed);

export default router;