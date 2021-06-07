const Router = require('koa-router');
const authentication = require('../controllers/authentication.js');
const { validateSignUp } = require('../middleware/validator');

const router = new Router();

router.post('/login', authentication.login);
router.post('/signup', validateSignUp, authentication.signup);
router.post('/token', authentication.refreshToken);
router.post('/logout', authentication.logout);

module.exports = router;
