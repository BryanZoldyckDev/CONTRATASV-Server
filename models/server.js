 const express = require('express')
const cors = require('cors');
const fileUpload = require('express-fileupload');


const { dbConnection } = require('../database/config');


class Server {
    constructor () {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth:           '/api/auth',
            offers:         '/api/offers',
            professions:    '/api/professions',
            requests:       '/api/requests',
            roles:          '/api/roles',
            search:         '/api/search',
            uploads:        '/api/uploads',
            users:          '/api/users',
        }


        //Conectar a base de datos
        this.connectDB();

        //Middlewares
        this.middleWares();

        //Rutas de mi app
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middleWares(){

        //CORS
        this.app.use(cors());

        //Parseo y lectura del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'))

        //File upload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true,
        }));

    }

    routes() {
        
        this.app.use(this.paths.auth,             require('../routes/auth'))
        this.app.use(this.paths.users,            require('../routes/users'))
        this.app.use(this.paths.offers,           require('../routes/offers'))
        this.app.use(this.paths.professions,      require('../routes/professions'))
        this.app.use(this.paths.roles,            require('../routes/roles'))
        this.app.use(this.paths.requests,         require('../routes/requests'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto: ', this.port);
        })
    }
}

module.exports = Server;