const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, hasRole, isAdmin} = require('../middlewares');

const { validProfessionById } = require('../helpers/db-validators');

const { getProfessions,
        getProfessionById,
        getProfessionByName,
        createProfession,
        updateProfession,
        deleteProfession } = require('../controllers/professions');

const router = Router();

//Get all the professions - public acceso
router.get('/', getProfessions)

//Get one profession by id - public
router.get('/:id', [
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validProfessionById),
    validateFields
], getProfessionById)

//Create a new profession - private just admins
router.post('/', [
    validateJWT,
    isAdmin,
    check('name', 'Name is required').not().isEmpty(),
    validateFields
],createProfession)

//Update a profession by id - private just admins
router.put('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validProfessionById),
    check('name', 'Name is required').not().isEmpty(),
    validateFields
], updateProfession)

//Delete a role - private just admins
router.delete('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'Is not a valid a ID').isMongoId(),
    check('id').custom(validProfessionById),
    validateFields
],deleteProfession)

module.exports = router;