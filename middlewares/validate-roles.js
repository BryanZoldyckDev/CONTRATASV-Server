const { response } = require("express")
const {Role} = require('../models/')

const isAdmin = async(req, res = response, next) => {
    
    if (!req.user) {
        return res.status(500).json({
            msg: 'Role is trying to be validate, without validated the token'
        })
    }

    const {role, name} = req.user;

    const roleDB = await Role.findById(role).populate({path: 'name', select: 'name -_id'});


    if(roleDB.name != 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} is not an administrator - You can't do this`
        })
    }

    next();
}

const hasRole = (...roles) => {
    return async(req, res = response, next) => {

        if (!req.user) {
            return res.status(500).json({
                msg: 'Role is trying to be validate, without validated the token'
            })
        }
        
        const foundRoles = await Role.find({name: {$in: roles}});

        let rolesIds = [];

        foundRoles.map(rol => rolesIds.push(rol._id))

        const isInArray = rolesIds.some(role => {
            return role.equals(req.user.role);
        });

        if(!isInArray) {
            return res.status(401).json({
                msg: `The service needs one of this roles: ${roles}`
            })
        }

        next();
    }
}

module.exports = {
    isAdmin,
    hasRole
}