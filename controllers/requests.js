const {response, request} = require('express'); 

const {Offer, Request, User} = require('../models/');

const hourFormater = (hour) => {
    if (hour.length === 5) {
        return `${hour.slice(0,2)}:${hour.slice(3)}`;
    }

    if (hour.length === 4) {
        return`0${hour.slice(0,1)}:${hour.slice(2)}`;
    }
    
    if (hour.length === 2) {
        return`${hour}:00`;
    }
  
  if (hour.length === 1) {
        return`0${hour}:00`;
    }
}

validateDate = (startdate, enddate) => {
    if(!startdate instanceof Date || !enddate instanceof Date) {
        return res.status(400).json({
            msg: `${startdate} or ${enddate} is not a valid date`
        });
    }
    
    const d1 = new Date(startdate);
    const d2 = new Date(enddate);

    if(d1 > d2) {
        return res.status(401).json({
            msg: `The end date ${enddate} is before the start date ${startdate}`
        })
    }
}

const getRequests = async(req = request, res = response) => {

    //const {q, nombre = 'No name', page = '1'} = req.query;
    const {limit = 10, from = 0} = req.query;

    // const users = await User.find(query)
    // .skip(Number(from))
    // .limit(Number(limit));

    // const total = await User.countDocuments(query);

    const [total, requests] = await Promise.all([
        Request.countDocuments(query),
        Request.find()
            .skip(Number(from))
            .limit(Number(limit))
            .populate({path: 'contratist', select: 'name -_id, lastname -_id, phone -_id, email -_id'})
            .populate({path: 'profession', select: 'name -_id'})
            .populate({path: 'offer', select: 'title -_id'})
    ])

    return res.status(200).json({
        total,
        requests
    })
}

const getRequestsByUser = async(req = request, res = response) => {
    const user = await User.findById(req.user._id).populate({path: 'role', select: 'name -_id'});
    const {limit = 10, from = 0} = req.query;
    let query;

    user.role.name === 'CONTRATIST_ROLE' ? query = {contratist: req.user._id} : query = {client: req.user._id};

    const [total, requests] = await Promise.all([
        Request.countDocuments(query),
        Request.find(query)
            .skip(Number(from))
            .limit(Number(limit))
            .populate({path: 'contratist', select: 'name -_id, lastname -_id, phone -_id, email -_id'})
            .populate({path: 'client', select: 'name -_id, lastname -_id, phone -_id, email -_id'})
            .populate({path: 'offer', select: 'title -_id'})
    ])

    return res.status(200).json({
        total,
        requests
    })

}

const getRequestById = async(req = request, res = response) =>{
    const {id} = req.params;

    const request = await Request.find(id).populate({path: 'contratist', select: 'name -_id, lastname -_id, phone -_id, email -_id'})
    .populate({path: 'client', select: 'name -_id, lastname -_id, phone -_id, email -_id'})
    .populate({path: 'offer', select: 'title -_id'});

    return res.status(200).json(request);
}


const postRequest = async(req, res = response) => {

    const loggedUser = req.user;
    
    const {offer, address, workinghours, startdate, enddate} = req.body;

    //validar request address
    if(!address.toUpperCase().includes("SANTA TECLA") && !address.toUpperCase().includes("SAN SALVADOR")) {
        return res.status(401).json({
            msg: `The request address needs to be in: SANTA TECLA or in SAN SALVADOR`
        })
    }

    //validarFecha
    validateDate(startdate, enddate);

    //validar y formatear working hours
    const formatedHours = hourFormater(workinghours);

    //validar oferta
    const offerDB = await Offer.findById(offer);

    const requestDB = await Request.findOne({offer: offerDB._id, contratist: offerDB.contratist, client: loggedUser._id, status: "PENDING"});

    if(requestDB){
        return res.status(401).json({
            msg: `You already submitted a request for this offer, wait for an answer`
        })
    }

    const request = new Request({offer: offerDB._id, contratist: offerDB.contratist, client: loggedUser._id, workinghours: formatedHours, address: address, startdate, enddate});

        //Guardar en DB
    await request.save();

    return res.status(201).json(request);
}

//TODO: EDITAR SOLICITUD

const cancelRequest = async(req, res = response) => {
    const loggedUser = req.user;
    
    const {id} = req.params;

    const requestUser = await Request.findById(id);

    if (requestUser.client.toString() !== loggedUser._id.toString()){
        return res.status(400).json({
            msg: `You can't delete this request, it doesn't belong to you`
        });
    }

    const request = await Request.findByIdAndUpdate(id, {status: "CANCELED"})
    .populate({path: 'contratist', select: 'name lastname phone email -_id'})
    .populate({path: 'client', select: 'name lastname phone email -_id'})
    .populate({path: 'offer', select: 'title -_id'});
    
    return res.status(200).json(request)
}

const requestDecision = async(req, res = response) => {
    const loggedUser = req.user;

    const { decision } = req.body;
    const { id } = req.params;

    const requestUser = await Request.findById(id);

    if (requestUser.contratist.toString() !== loggedUser._id.toString()){
        return res.status(400).json({
            msg: `You can't decide on this request, it's not for you`
        });
    }

    if(decision){
        const request = await Request.findByIdAndUpdate(id, {status: "ACCEPTED"})
        .populate({path: 'contratist', select: 'name lastname phone email -_id'})
        .populate({path: 'client', select: 'name lastname phone email -_id'})
        .populate({path: 'offer', select: 'title -_id'});;

        return res.status(200).json(request);
    }

    const request = await Request.findByIdAndUpdate(id, {status: "DECLINED"})
    .populate({path: 'contratist', select: 'name lastname phone email -_id'})
    .populate({path: 'client', select: 'name lastname phone email -_id'})
    .populate({path: 'offer', select: 'title -_id'});

    return res.status(200).json(request);
}

module.exports = {
    getRequests,
    getRequestsByUser,
    postRequest,
    cancelRequest,
    requestDecision
}