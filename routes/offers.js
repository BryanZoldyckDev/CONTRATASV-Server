const { Router } = require('express');
const { check } = require('express-validator');

const {validateFields, validateJWT, hasRole} = require('../middlewares/');
const {validProfession, validOfferById} = require('../helpers/db-validators');

const { getOffers, 
        getOfferById, 
        postOffers, 
        putOffers, 
        deleteOffers, 
        unarchiveOffers} = require('../controllers/offers');

const router = Router();

router.get('/', getOffers);

router.get('/:id', [
    check('id', `Isn't a valid ID`).isMongoId(),
    check('id').custom(validOfferById),
    validateFields
], getOfferById);

//Crate a new offer only contratist could do this.
router.post('/', [
    validateJWT,
    hasRole('CONTRATIST_ROLE'),
    check('title', 'Name is required').not().isEmpty(),
    check('payment', 'Payment method is required').not().isEmpty(),
    check('payday', 'Payment expected time is required').not().isEmpty(),
    check('profession', 'Profession is required').not().isEmpty(),
    check('profession').custom(validProfession),
    check('area', 'Area is required').not().isEmpty(),
    check('description', 'Description is required').isLength({min: 10, max: 150}),
    validateFields
], postOffers)

router.put('/:id', [
    validateJWT,
    hasRole('CONTRATIST_ROLE'),
    check('id', 'Is not a valid a ID').isMongoId(),
    check('id').custom(validOfferById),
    check('profession').custom(validProfession),
    validateFields
], putOffers)

router.delete('/:id', [
    validateJWT,
    hasRole('CONTRATIST_ROLE'),
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validOfferById),
    validateFields
], deleteOffers)

router.put('/unarchive/:id', [
    validateJWT,
    hasRole('CONTRATIST_ROLE'),
    check('id', 'Is not a valid ID').isMongoId(),
    check('id').custom(validOfferById),
    validateFields
], unarchiveOffers)

module.exports = router;