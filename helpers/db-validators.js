const {Profession, Role, User, Offer, Request, Contract} = require('../models')

//USERS
const validRole =  async(role = '') => {
    const existeRole = await Role.findOne({name: role});
    if(!existeRole) {
        throw new Error(`Role ${role} doesn't exists in database`)
    }
}

const validProfession =  async(profession = '') => {
    const existeProfession = await Profession.findOne({name: profession.toUpperCase()});
    if(!existeProfession) {
        throw new Error(`Profession ${profession} doesn't exists in database`)
    }
}

//OFFERS
const validOfferById = async( id ) => {
    const idExists = await Offer.findById(id);
    if (!idExists){
        throw new Error(`Id ${id} doesn't exists in database`)
    }
}

const validRequestById = async( id ) => {
    const idExists = await Request.findById(id);
    if (!idExists){
        throw new Error(`Id ${id} doesn't exists in database`)
    }
}

const validContractById = async( id ) => {
    const idExists = await Contract.findById(id);
    if (!idExists){
        throw new Error(`Id ${id} doesn't exists in database`)
    }
}



const validEmail = async(email) => {
    const emailExists = await User.findOne({email});
    if (emailExists){
        throw new Error(`Email ${email} already exists in database`)
    }
}
const validDUI = async(dui) => {
    const DUIExists = await User.findOne({dui});
    if (DUIExists){
        throw new Error(`DUI ${dui} already exists in database`)
    }
}

const validUserById = async( id ) => {
    const idExists = await User.findById(id);
    if (!idExists){
        throw new Error(`Id ${id} doesn't exists in database`)
    }
}

const validUserByDUI = async( dui ) => {
    const DUIExists = await User.findOne({dui});
    if (!DUIExists){
        throw new Error(`DUI ${dui} doesn't exists in database`)
    }
}

//ROLES

const validRoleById = async( id ) => {
    const roleExists = await Role.findById(id);
    if (!roleExists){
        throw new Error(`Id ${id} doesn't exists in database`)
    }
}




//PROFESSIONS

const validProfessionById = async( id ) => {
    const professionExists = await Profession.findById(id);
    if (!professionExists){
        throw new Error(`Id ${id} doesn't exists in database`)
    }
}

const collectionsAllowed = async(collection = '', collections = []) => {
    const collectionExits = collections.includes(collection);

    if(!collectionExits) {
        throw new Error(`The ${collection} is not allowed, valid collections are: ${collections}`);
    }

    return true;
}
module.exports = {
    collectionsAllowed,
    validRole,
    validEmail,
    validProfession,
    validUserById,
    validRoleById, 
    validProfessionById,
    validDUI,
    validUserByDUI,
    validOfferById,
    validRequestById,
    validContractById
}