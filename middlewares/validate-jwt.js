const { response, request } = require('express')
const jwt = require('jsonwebtoken')

const User = require('../models/user');

const validateJWT = async(req = request, res = response, next) => {

    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            msg: 'There is no token in the request',
        });
    }

    try {
        const {uid}= jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        //leer el usuario que corresponde al uid
        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'Token is no valid - the user could not be found in the database'
            })
        }
        //Verificar si el uid tiene estado en true
        if (!user.status){
            return res.status(401).json({
                msg: 'Token is no valid - user status is not valid'
            })
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token is not valid'
        })
    }
}

module.exports = {
    validateJWT,
}