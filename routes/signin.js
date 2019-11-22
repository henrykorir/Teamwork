const Router = require('express');
const signInController = require('../controllers/signin');
const router = Router();

router.post('/signin',signInController.signIn);


module.exports = router;