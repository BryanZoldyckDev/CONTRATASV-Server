const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares');

const { login, googleSingIn } = require('../controllers/auth');


const router = Router();

router.post('/login', [
    check('email' , 'E-mail is required').isEmail(),
    check('password' , 'Password is required').not().isEmpty(),
    validateFields,
], login)

router.post('/google', [
    check('id_token' , 'ID token is required').not().isEmpty(),
    validateFields,
], googleSingIn)

module.exports = router;