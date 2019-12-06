import Router from 'express';
import auth from '../middlewares/auth';
import { 
	postArticle, 
	patchArticleById, 
	deleteArticleById, 
	getArticle, 
	getArticleById, 
	postCommentByArticleId 
} from '../controllers/articles';

const router = Router();

router.post('/articles',auth,postArticle);
router.patch('/articles/:articleId',auth,patchArticleById);
router.delete('/articles/:articleId',auth,deleteArticleById);
router.post('/articles/:articleId/comment',auth, postCommentByArticleId);
router.get('/articles/:articleId',auth, getArticleById);

export default router;