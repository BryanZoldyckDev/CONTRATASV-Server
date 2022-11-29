const { response, request } = require('express');

const {Role} = require('../models');

//getProfessions - paged - total - populate
const getRoles = async(req = request, res = response) => {
    const {from = 0, to = 10} = req.query;
    const query = {status:true};

    const [total, roles] = await Promise.all([
        Role.countDocuments(query),
        Role
            .find(query)
            .skip(Number(from))
            .limit(Number(to))
            .populate({path: 'name'})
    ])

    res.status(200).json({
        total,
        roles,
    });
}

//getProfession - populate 

const getRoleById = async(req = request, res = response) => {
    
    const { id } = req.params;

    const role = await Role.findById(id).populate({path: 'name', select: 'name -_id'});

    return res.status(200).json(role)
}

const createRole = async(req, res = response) => {

    const name = req.body.name.toUpperCase();

    const roleDB = await Role.findOne({name});

    if (roleDB) {
        return res.status(400).json({
            msg: `The role ${roleDB.name} already exists`
        });
    }

    //Generate data to save
    const data = {
        name
    }

    const role = await new Role(data);

    //Save ind DB
    await role.save();

    return res.status(200).json(role);
}

//updateRole
const updateRole = async(req = request, res = response) => {
    
    const {id} = req.params;

    const {...data} = req.body;

    const role = await Role.findByIdAndUpdate(id, data, {new: true});

    return res.status(200).json(role);
}

//deleteProfession - status:false
const deleteRole = async(req = request, res = response) => {
    const { id } = req.params;

    const role = await Role.findByIdAndUpdate(id, {status: false}, {new:true});

    return res.status(200).json(role);
}



module.exports = {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
}