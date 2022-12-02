const { response } = require('express');
const {ObjectId} = require('mongoose').Types;

const {User, Contract, Offer, Request, Profession} = require('../models')

const collectionsAllowed = [
    'professions',
    'contracts',
    'users',
    'offers',
    'requests'
];


const searchOffers = async(term = '', res = response) =>{

    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const user = await User.findById(term);
        return res.json({
            results: (user) ?  [user] : [],
        });
    }

    const regex = new RegExp( term, 'i');

    const users = await User.find({
        $or: [{name: regex}, {email: regex}],
        $and: [{status:true}]
    });

    res.json({
        results: users
    });
}



const search = async(req, res = response) => {

    const {collection, term} = req.params;

    if(!collectionsAllowed.includes(collection)) {
        return res.status(400).json({
            msg: `Collections allowed are : ${collectionsAllowed}`
        })
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
        break;
        case 'offers':
            searchCategories(term, res);
        break;
        case 'contracts':
            searchProducts(term, res);
        break;
        case 'requests':
            searchProducts(term, res);
        break;
        default:
            res.status(500).json({
                msg: 'I forgot about did this search '
            })

    }
}

module.exports = {
    search,
}