const { response, request } = require('express');

const {Profession} = require('../models');

//getProfessions - paged - total - populate
const getProfessions = async(req = request, res = response) => {
    const {from = 0, to = 10} = req.query;
    const query = {status:true};

    const [total, professions] = await Promise.all([
        Profession.countDocuments(query),
        Profession
            .find(query)
            .skip(Number(from))
            .limit(Number(to))
            .select('-user')
    ])

    res.status(200).json({
        total,
        professions,
    });
}

//getProfessionById - populate 

const getProfessionById = async(req = request, res = response) => {
    
    const { id } = req.params;

    const profession = await Profession.findById(id).populate({path: 'user', select: 'name -_id'});

    res.status(200).json(profession)
}

//getProfessionByName - populate 

const getProfessionByName = async(req = request, res = response) => {
    
    const { name } = req.params;

    const profession = await Profession.findOne({name}).populate({path: 'user', select: 'name -_id'});

    res.status(200).json(profession)
}

//createProfession
const createProfession = async(req, res = response) => {

    const name = req.body.name.toUpperCase();

    const professionDB = await Profession.findOne({name});

    if (professionDB) {
        return res.status(400).json({
            msg: `The profession ${professionDB.name} already exists`
        });
    }

    //Generate data to save
    const data = {
        name,
        user: req.user._id
    }

    const profession = await new Profession(data);

    //Save ind DB
    await profession.save();

    res.status(200).json(profession);
}

//updateCategory 
const updateProfession = async(req = request, res = response) => {
    
    const {id} = req.params;

    const {status, user, ...data} = req.body;

    data.name = req.body.name.toUpperCase();
    data.user = req.user._id;

    const profession = await Profession.findByIdAndUpdate(id, data, {new: true}).populate({path: 'user', select: 'name -_id, lastname -_id'})

    return res.status(200).json(profession);
}

//deleteProfession - status:false
const deleteProfession = async(req = request, res = response) => {
    const { id } = req.params;

    const profession = await Profession.findByIdAndUpdate(id, {status: false}, {new:true}).populate({path: 'user', select: 'name -_id, lastname -_id'});

    return res.status(200).json(profession);
}



module.exports = {
    getProfessions,
    getProfessionByName,
    getProfessionById,
    createProfession,
    updateProfession,
    deleteProfession,
}