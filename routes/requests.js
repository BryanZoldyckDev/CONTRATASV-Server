const { Router } = require('express');
const { check } = require('express-validator');

const {validateFields, validateJWT, hasRole} = require('../middlewares/');
const {validProfession, validOfferById, validUserByDUI, validRequestById} = require('../helpers/db-validators');

const { getRequests,
        getRequestsByUser,
        postRequest, 
        requestDecision,
        cancelRequest} = require('../controllers/requests');

const router = Router();

router.get('/', getRequests);

//Get all request by user
router.get('/profile', [validateJWT], getRequestsByUser);

//Crate a new offer only contratist could do this.
router.post('/', [
    validateJWT,
    hasRole('CLIENT_ROLE'),
    check('offer', 'Is not a valid a ID').isMongoId(),
    check('offer').custom(validOfferById),
    check('address', 'Area is required').not().isEmpty(),
    check('workinghours', 'Working hours is required').isLength({min: 1, max: 5}),
    check(['startdate', 'enddate'], 'Starting date and end date must be dates').isDate(),
    validateFields
], postRequest)

//Contratist accept or decline request
router.put('/:id', [
    validateJWT,
    hasRole('CONTRATIST_ROLE'),
    check('id', 'Is not a valid a ID').isMongoId(),
    check('id').custom(validRequestById),
    check('decision').isBoolean(),
    validateFields
], requestDecision)

//Client cancel a request
router.delete('/:id', [
    validateJWT,
    hasRole('CLIENT_ROLE'),
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validRequestById),
    validateFields
], cancelRequest)

module.exports = router;