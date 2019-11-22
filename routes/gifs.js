const Router = require('express');
const router = Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

const gifsController = require('../controllers/gifs');


router.post('/gifs', multer, gifsController.postGif);
router.get('/gifs/:gifId',gifsController.getGifById);
router.delete('/gifs/:gifId',auth,gifsController.deleteGifById);
router.post('/gifs/:gifsId/comment',auth, gifsController.postCommentByGifId);


module.exports = router;