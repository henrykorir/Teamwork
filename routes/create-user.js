const Router = require('express');
const createUserController = require('../controllers/create-user');
const router = Router();

router.post('/create-user',createUserController.createUser);

module.exports = router;