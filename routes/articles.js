const Router = require('express');
const articleController = require('../controllers/articles');
const auth = require('../middlewares/auth');
const router = Router();

router.post('/articles',auth,articleController.postArticle);
router.patch('/articles/:articleId',auth,articleController.patchArticleById);
router.delete('/articles/:articleId',auth,articleController.deleteArticleById);
router.get('/articles',auth, articleController.getArticle);
router.post('/articles/:articleId/comment',auth, articleController.postCommentByArticleId);
router.get('/articles/:articleId',auth, articleController.getArticleById);

module.exports = router;