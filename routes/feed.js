const Router = require('express');
const feedController = require('../controllers/feed');
const auth = require('../middlewares/auth');
const router = Router();

router.get('/feed',auth,feedController.getFeed);

module.exports = router;