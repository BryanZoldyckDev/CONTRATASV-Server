const { Router } = require('express');
const { check } = require('express-validator');

const {validateFields, validateJWT, hasRole} = require('../middlewares/');
const {validRequestById, validContractById} = require('../helpers/db-validators');

const { getContractById,
        getContracts,
        getContractsByUser,
        postContract,
        cancelContract} = require('../controllers/contracts');

const router = Router();

router.get('/', getContracts);

//Get all contracts by user
router.get('/profile', [validateJWT], getContractsByUser)

router.get('/:id', [
    validateJWT,
    hasRole('CONTRATIST_ROLE', 'CLIENT_ROLE'),
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validContractById),
    validateFields
], getContractById);

//Crate a new contract only contratist could do this.
router.post('/', [
    validateJWT,
    hasRole('CONTRATIST_ROLE'),
    check('request', 'Is not a valid ID').isMongoId(),
    check('request').custom(validRequestById),
    validateFields
], postContract)

//Client or contratist cancel a contratist
router.delete('/:id', [
    validateJWT,
    hasRole('CLIENT_ROLE', 'CONTRATIST_ROLE'),
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validContractById),
    validateFields
], cancelContract)

module.exports = router;