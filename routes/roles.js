const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, hasRole, isAdmin} = require('../middlewares');

const { validRoleById } = require('../helpers/db-validators');

const { getRoles,
        getRoleById,
        createRole,
        updateRole,
        deleteRole } = require('../controllers/roles');

const router = Router();

//Get all the roles - public acceso
router.get('/', getRoles)

//Get one role by id - public
router.get('/:id', [
        check('id', 'Is not a valid ID').isMongoId(),
        check('id').custom(validRoleById),
        validateFields
], getRoleById)

//Create a new role - private just admins
router.post('/', [
    validateJWT,
    isAdmin,
    check('name', 'Name is required').not().isEmpty(),
    validateFields
],createRole)

//Update a role by id - private just admins
router.put('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validRoleById),
    check('name', 'Name is required').not().isEmpty(),
    validateFields
], updateRole)

//Delete a role - private just admins
router.delete('/:id', [
    validateJWT,
    isAdmin,
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validRoleById),
    validateFields
],deleteRole)

module.exports = router;