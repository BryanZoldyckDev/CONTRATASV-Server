const {response, request} = require('express'); 

const {Request, User, Contract} = require('../models/');


const getContracts = async(req = request, res = response) => {

    //const {q, nombre = 'No name', page = '1'} = req.query;
    const {limit = 10, from = 0} = req.query;

    // const users = await User.find(query)
    // .skip(Number(from))
    // .limit(Number(limit));

    // const total = await User.countDocuments(query);

    const [total, contracts] = await Promise.all([
        Contract.countDocuments(),
        Contract.find()
            .skip(Number(from))
            .limit(Number(limit))
            .populate({path: 'request', select: 'offer contratist client address workinghours startdate enddate -_id',
                        populate: [{path: 'offer', select: 'title -_id'}, 
                                        {path: 'contratist', select: 'name lastname phone email -_id'}, 
                                            {path: 'client', select: 'name lastname phone email -_id'}]})
    ])

    return res.status(200).json({
        total,
        contracts
    })
}

const getContractsByUser = async(req = request, res = response) => {
    //extraigo mi usuario
    const user = await User.findById(req.user._id).populate({path: 'role', select: 'name -_id'});
    
    let query;

    user.role.name === 'CONTRATIST_ROLE' ? query = {contratist: req.user._id} : query = {client: req.user._id};

    query.status = "ACCEPTED";

    const request = await Request.find(query);

    let ids = [];

    request.map( request => ids.push(request._id))

    const {limit = 10, from = 0} = req.query;

    const queryContract = {request: {$in: ids}};

    const [total, contracts] = await Promise.all([
        Contract.countDocuments(queryContract),
        Contract.find(queryContract)
            .skip(Number(from))
            .limit(Number(limit))
            .populate({path: 'request', select: 'offer contratist client address workinghours startdate enddate -_id',
                        populate: [{path: 'offer', select: 'title -_id'}, 
                                        {path: 'contratist', select: 'name lastname phone email -_id'}, 
                                            {path: 'client', select: 'name lastname phone email -_id'}]})

    ])

    return res.status(200).json({
        total,
        contracts
    })

}

const getContractById = async(req = request, res = response) =>{
    const {id} = req.params;

    const contract = await Contract.find(id)
    .populate({path: 'request', select: 'offer contratist client address workinghours startdate enddate -_id',
                populate: [{path: 'offer', select: 'title -_id'}, 
                                {path: 'contratist', select: 'name lastname phone email -_id'}, 
                                    {path: 'client', select: 'name lastname phone email -_id'}]});

    return res.status(200).json(contract);
}


const postContract = async(req, res = response) => {
    
    const {request} = req.body;

    const contractDB = await Contract.findOne({request: request, status: "IN PROGRESS"})
    .populate({path: 'request', select: 'offer contratist client address workinghours startdate enddate -_id'})

    if(contractDB){
        return res.status(401).json({
            msg: `You already signed a contract for this request`
        })
    }

    const contract = new Contract({request});
    //Guardar en DB
    await contract.save();

    return res.status(201).json(contract);
}

//TODO: EDITAR SOLICITUD

const cancelContract = async(req, res = response) => {
    const loggedUser = req.user;
    
    const {id} = req.params;

    const contractUser = await Contract.findById(id);

    const requestUser = await Request.findById(contractUser.request);

    if (requestUser.client.toString() !== loggedUser._id.toString() && requestUser.contratist.toString() !== loggedUser._id.toString()){
        return res.status(400).json({
            msg: `You can't cancel this request, it doesn't belong to you`
        });
    }

    const contract = await Contract.findByIdAndUpdate(id, {status: "CANCELED"})
    .populate({path: 'request', select: 'offer contratist client address workinghours startdate enddate -_id',
                populate: [{path: 'offer', select: 'title -_id'}, 
                                {path: 'contratist', select: 'name lastname phone email -_id'}, 
                                    {path: 'client', select: 'name lastname phone email -_id'}]});

    return res.status(200).json(contract)
}

module.exports = {
    getContractById,
    getContracts,
    getContractsByUser,
    postContract,
    cancelContract,
}