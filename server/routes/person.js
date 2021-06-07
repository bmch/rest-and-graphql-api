const Router = require('koa-router');
const person = require('../controllers/person.js');
const { validatePost } = require('../middleware/validator');
const { authJWT } = require('../middleware/authentication');
const BASE_URL = `/api/v1/person`;

const router = new Router();

router.get(BASE_URL, authJWT, person.list);
router.get(`${BASE_URL}/:id`, person.findById);
router.post(BASE_URL, validatePost, person.add);
router.delete(`${BASE_URL}/:id`, person.delete);
router.put(`${BASE_URL}/:id`, validatePost, person.update);

module.exports = router;
