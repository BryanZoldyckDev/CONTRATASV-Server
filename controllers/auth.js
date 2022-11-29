const {response} = require('express');
const bcryptjs = require('bcryptjs');

const {User, Role} = require('../models/');
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res = response) => {

    const {email, password} = req.body;

    try {
        //Verificar si el correo existe
        const user = await User.findOne({email});


        if (!user){
            return res.status(400).json({
                msg: 'User/Password are incorrect - email'
            })
        }
        //Verificar suario activo
        if (!user.status){
            return res.status(400).json({
                msg: 'User/Password are incorrect - status: false'
            })
        }
        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'User/Password are incorrect - password'
            })
        }

        //Generar el JWT
        const token = await generateJWT(user.id);

        const {name} = await Role.findById({_id: user.role});
        
        res.json({
            user,
            role: name,
            token
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Something gone wrong, talk to Bryan'
        });
    }


}

const googleSingIn = async(req, res = response) => {

    const {id_token} = req.body;

    try {

        const { email, name, img} = await googleVerify(id_token);

        let user = await User.findOne({email});

        if (!user) {
            //If user doesn't exists

            const data = {
                name,
                email,
                password: 'XD',
                img,
                google:true,
            };

            user = new User(data);
            await user.save();
        }
        
        //If user in db 

        if(!user.status) {
            return res.status(401).json({
                msg: 'Talk to the administrator, user blocked'
            });
        }

        //Generate JWT

        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        })

    } catch (error) {

        res.status(400).json({
            msg: 'Google token is invalid'
        })

    }
}

module.exports = {
    login,
    googleSingIn,
}