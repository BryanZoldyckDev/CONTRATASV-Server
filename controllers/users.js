const {response, request} = require('express');
const bcryptjs = require('bcryptjs');

const {User, Profession, Role} = require('../models/');

//DUI formater

const duiFormater = (dui) => {
    if (dui.length === 10) {
        return `${dui.slice(0,8)}-${dui.slice(9)}`
    }

    if (dui.length === 9) {
        return `${dui.slice(0,8)}-${dui.slice(8)}`
    }
}

const phoneFormater = (phone) => {
    if (phone.length === 8) {
        return `${phone.slice(0,4)}-${phone.slice(4)}`
    }

    if (phone.length === 9) {
        return `${phone.slice(0,4)}-${phone.slice(5)}`
    }
}



const getUsers = async(req = request, res = response) => {

    //const {q, nombre = 'No name', page = '1'} = req.query;
    const {limit = 10, from = 0} = req.query;
    const query = {status:true};

    // const users = await User.find(query)
    // .skip(Number(from))
    // .limit(Number(limit));

    // const total = await User.countDocuments(query);

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.status(200).json({
        total,
        users
    })
}

const getProfile = async(req = request, res = response) => {
    const idLoggedUser = req.user._id;

    const profile = await User.findById(idLoggedUser).populate({path: 'role', select: 'name -_id'}).populate({path: 'profession', select: 'name -_id'});

    res.status(200).json(profile)
}

const postUsers = async(req, res = response) => {
    
    const {password, role, dui, birthdate, profession, phone, ...body} = req.body;
    
    //formatear y validar DUI
    const duiFormated = duiFormater(dui);
    
    const duiDB = await User.findOne({dui: duiFormated});
    
    if(duiDB) {
        return res.status(400).json({
            msg: `The DUI ${duiFormated} already exists in database`
        });
    }

    //validar role

    const roleDB = await Role.findOne({name: role.toUpperCase()}).populate({path: 'name', select: 'name -_id'});

    //formatear y validar telefono
    const phoneFormated = phoneFormater(phone);

    const phoneDB = await User.findOne({phone: phoneFormated, role: roleDB._id});

    if(phoneDB) {
        return res.status(400).json({
            msg: `The phone ${phoneFormated} already belongs to a registered user in database`
        });
    }
    
    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    const encryptedPassword = bcryptjs.hashSync( password, salt );

    //validar fecha
    if(!birthdate instanceof Date) {
        return res.status(400).json({
            msg: `${birthdate} is not a valid date`
        });
    }

    //validar profession
    if(profession?.length > 0) {

        const upperProfessions = profession.map(e => e.toUpperCase()) 

        const foundProfession = await Profession.find({name: {$in: upperProfessions}})
        
        if(foundProfession) {
            let professionsIds = []
            foundProfession.map(prof => {professionsIds.push(prof._id)});

            const user = new User({password: encryptedPassword, role: roleDB._id, profession: professionsIds, dui: duiFormated, phone: phoneFormated, birthdate, ...body});

            //Guardar en DB
            await user.save();

            return res.status(201).json(user);
        }
    }

    const user = new User({password: encryptedPassword, role: roleDB._id, dui: duiFormated, phone: phoneFormated, birthdate, ...body});

        //Guardar en DB
    await user.save();

    return res.status(201).json(user);
}

const putUsers = async(req, res = response) => {

    const {id} = req.params;

    const {_id, score, password, role, dui, birthdate, profession, google, phone, ...body} = req.body;

    //formatear y validar DUI
    if(dui){
        const duiFormated = duiFormater(dui);
    
        const duiDB = await User.findOne({dui: duiFormated});

        if(duiDB && (duiDB._id).toString() !== id) {
            return res.status(400).json({
                msg: `The DUI ${duiFormated} already exists in database`
            });
        }

        body.dui = duiFormated;
    }
    
    if(phone) {
        //formatear y validar telefono
        const phoneFormated = phoneFormater(phone);
        console.log(phoneFormated);

        const roleDB = await User.findById(id);

        const phoneDB = await User.findOne({phone: phoneFormated, role: roleDB.role});

        if(phoneDB && (phoneDB._id).toString() !== id) {
            return res.status(400).json({
                msg: `The phone ${phoneFormated} already belongs to a registered user in database`
            });
        }

        body.phone = phoneFormated;
    }

    if (role) {
        //validar role

        const roleDB = await Role.findOne({name: role.toUpperCase()}).populate({path: 'name', select: 'name -_id'});

        body.role = roleDB._id;
    }

    if (password) {
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        body.password = bcryptjs.hashSync( password, salt );
    }

    if (birthdate) {
        //validar fecha
        if(!birthdate instanceof Date) {
            return res.status(400).json({
                    msg: `${birthdate} is not a valid date`
            });
        }

        body.birthdate = birthdate;
    }   

    //validar profession
    if(profession?.length > 0) {

        const upperProfessions = profession.map(e => e.toUpperCase()) 

        const foundProfession = await Profession.find({name: {$in: upperProfessions}})
        
        if(foundProfession) {
            let professionsIds = []
            foundProfession.map(prof => {professionsIds.push(prof._id)});

            body.profession = professionsIds;

            const user = await User.findByIdAndUpdate(id, body, {new:true}).populate({path: 'role', select: 'name -_id'}).populate({path: 'profession', select: 'name -_id'});

            return res.status(201).json(user);
        }
    }

    const user = await User.findByIdAndUpdate(id, body, {new:true}).populate({path: 'role', select: 'name -_id'}).populate({path: 'profession', select: 'name -_id'});

    return res.status(201).json(user);
}

const deleteUsers = async(req, res = response) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, {status: false});
    //const userAuth = req.user;
    
    res.status(200).json(user)
}

const putProfile = async(req = request, res = response) => {

    const {id} = req.params;

    if ((req.user._id).toString() !== id) {
        return res.status(400).json({
            msg: `You can't edit another profile`
        });
    }

    const {_id, password, score, role, dui, birthdate, profession, google, phone, ...body} = req.body;

    if (password) {
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        body.password = bcryptjs.hashSync( password, salt );
    } 

    if(phone) {
        //formatear y validar telefono
        const phoneFormated = phoneFormater(phone);

        const phoneDB = await User.findOne({phone: phoneFormated, role: (req.user.role)});

        if(phoneDB && (phoneDB._id).toString() !== id) {
            return res.status(400).json({
                msg: `The phone ${phoneFormated} already belongs to a registered user in database`
            });
        }

        body.phone = phoneFormated;
    }

    //validar profession
    if(profession?.length > 0) {

        const upperProfessions = profession.map(e => e.toUpperCase()) 

        const foundProfession = await Profession.find({name: {$in: upperProfessions}})
        
        if(foundProfession) {
            let professionsIds = []
            foundProfession.map(prof => {professionsIds.push(prof._id)});

            body.profession = professionsIds;

            const user = await User.findByIdAndUpdate(id, body, {new:true}).populate({path: 'role', select: 'name -_id'}).populate({path: 'profession', select: 'name -_id'});

            return res.status(201).json(user);
        }
    }

    const user = await User.findByIdAndUpdate(id, body, {new:true}).populate({path: 'role', select: 'name -_id'}).populate({path: 'profession', select: 'name -_id'});

    return res.status(201).json(user);
}


module.exports = {
    getUsers,
    getProfile,
    postUsers,
    putUsers,
    putProfile,
    deleteUsers,
}

