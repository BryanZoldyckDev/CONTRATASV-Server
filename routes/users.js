const { Router } = require('express');
const { check } = require('express-validator');

const {validateFields, validateJWT, isAdmin, hasRole} = require('../middlewares/');
const { validRole, 
        validEmail, 
        validUserById, 
        validDUI } = require('../helpers/db-validators');

const { getUsers, 
        postUsers, 
        deleteUsers, 
        putUsers,
        putProfile,  
        getProfile} = require('../controllers/users');

const router = Router();

router.get('/', getUsers);

router.get('/profile', [
    validateJWT
],getProfile);

//Crate a new user anyone could do this.
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('lastname', 'Lastname is required').not().isEmpty(),
    check('password', 'Password is required and must be more than 4 characters').isLength({min: 5}), 
    check('email', 'E-mail is not valid').isEmail(),
    check('birthdate', 'Birthdate must be a date between').isDate(),
    check('dui', 'DUI must be 9 numbers').isLength({min: 9, max: 10}),
    check('phone', 'Phone must be a 8 number').isLength({min: 8, max: 9}),
    check('email').custom(validEmail),
    check('role').custom(validRole),
    validateFields
], postUsers)

router.put('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'Is not a valid a ID').isMongoId(),
    check('id').custom(validUserById),
    check('birthdate', 'Birthdate must be a date between').isDate(),
    check('dui', 'DUI must be 9 numbers').isLength({min: 9, max: 10}),
    check('phone', 'Phone must be a 8 number').isLength({min: 8, max: 9}),
    check('email', 'E-mail is not valid').isEmail(),
    check('email').custom(validEmail),
    check('dui').custom(validDUI),
    check('role').custom(validRole),
    validateFields
],putUsers)

router.put('/profile/:id', [
    validateJWT,
    hasRole('CLIENT_ROLE', 'CONTRATIST_ROLE'),
    check('id', 'Is not a valid a ID').isMongoId(),
    check('id').custom(validUserById),
    check('email', 'E-mail is not valid').isEmail(),
    check('phone', 'Phone must be a 8 number').isLength({min: 8, max: 9}),
    check('email').custom(validEmail),
    validateFields
],putProfile)

router.delete('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validUserById),
    validateFields
], deleteUsers)

module.exports = router;