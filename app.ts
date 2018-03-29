import config from "./config";

import {UsersRoute} from "./routes/users";
import {GymsRoute} from "./routes/gyms";
import {PokemonRoute} from "./routes/pokemon";

import {IndexRoute} from "./routes/index";
import User from "./backend/User";

let express = require('express');
let mysql = require('mysql');

/**
 * This middleware provides a consistent API
 * for MySQL connections during request/response life cycle
 */
let myConnection = require('express-myconnection');


export default class Main {
    private static dbOptions = {
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        port: config.database.port,
        database: config.database.db
    };

    public static loggedInUser: User = new User();
    public static app = express();
    public static connection = mysql.createConnection(Main.dbOptions);

    constructor() {
        /**
         * Store database credentials in a separate config.js file
         * L
         oad the file/module and its values
         */


        /**
         * 3 strategies can be used
         * single: Creates single database connection which is never closed.
         * pool: Creates pool of connections. Connection is auto release when response ends.
         * request: Creates new connection per new request. Connection is auto close when response ends.
         */

        Main.app.use(myConnection(mysql, Main.dbOptions, 'request'));
        /**
         * setting up the templating view engine
         */
        Main.app.set('view engine', 'ejs');

        /**
         * Express Validator Middleware for Form Validation
         */
        let expressValidator = require('express-validator');
        Main.app.use(expressValidator());


        /**
         * body-parser module is used to read HTTP POST data
         * it's an express middleware that reads form's input
         * and store it as javascript object
         */
        let bodyParser = require('body-parser');
        /**
         * bodyParser.urlencoded() parses the text as URL encoded data
         * (which is how browsers tend to send form data from regular forms set to POST)
         * and exposes the resulting object (containing the keys and values) on req.body.
         */
        Main.app.use(bodyParser.urlencoded({extended: true}));
        Main.app.use(bodyParser.json());


        /**
         * This module let us use HTTP verbs such as PUT or DELETE
         * in places where they are not supported
         */
        let methodOverride = require('method-override');

        /**
         * using custom logic to override method
         *
         * there are other ways of overriding as well
         * like using header & using query value
         */
        Main.app.use(methodOverride(function (req: any, res: any) {
            if (req.body && typeof req.body === 'object' && '_method' in req.body) {
                // look in urlencoded POST bodies and delete it
                let method = req.body._method;
                delete req.body._method;
                return method;
            }
        }));

        /**
         * This module shows flash messages
         * generally used to show success or error messages
         *
         * Flash messages are stored in session
         * So, we also have to install and use
         * cookie-parser & session modules
         */
        let flash = require('express-flash');
        let cookieParser = require('cookie-parser');
        let session = require('express-session');

        Main.app.use(cookieParser('keyboard cat'));
        Main.app.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true,
            cookie: {maxAge: 60000}
        }));
        Main.app.use(flash());

        /**
         * import routes/index.js
         * import routes/users.js
         */
        // let index = require('./routes/index');

        // let pokemon = require('./routes/pokemon');

        // Main.app.use('/', index);
        Main.app.get('/', (req: any, res: any) => {
            IndexRoute.getIndex(req, res);
        });


        Main.app.get('/users', (req: any, res: any) => {
            UsersRoute.showUsers(req, res);
        });

        Main.app.get('/users/login', (req: any, res: any) => {
            UsersRoute.showLoginForm(req, res);
        });
        Main.app.post('/users/login', (req: any, res: any) => {
            UsersRoute.login(req, res);
        });

        Main.app.get('/users/register', (req: any, res: any) => {
            UsersRoute.showRegistrationForm(req, res);
        });
        Main.app.post('/users/register', (req: any, res: any) => {
            UsersRoute.register(req, res);
        });

        Main.app.get('/users/add', (req: any, res: any) => {
            UsersRoute.showAddUserForm(req, res);
        });
        Main.app.post('/users/add', (req: any, res: any) => {
            UsersRoute.addNewUser(req, res);
        });

        Main.app.get('/users/edit/(:id)', (req: any, res: any) => {
            UsersRoute.showEditUserForm(req, res);
        });
        Main.app.put('/users/edit/(:id)', (req: any, res: any) => {
            UsersRoute.editUser(req, res);
        });

        Main.app.delete('/users/delete/(:id)', (req: any, res: any) => {
            UsersRoute.deleteUser(req, res);
        });

        Main.app.get('/users/logout', (req: any, res: any) => {
            UsersRoute.logout(req, res);
        });

        Main.app.get('/pokemon', (req: any, res: any) => {
            PokemonRoute.get(req, res);
        });
        Main.app.get('/pokemon/types', (req: any, res: any) => {
            PokemonRoute.managePokemonTypes(req, res);
        });


        Main.app.get('/pokemon/types/edit/(:typeId)/(:typeName)', (req: any, res: any) => {
            PokemonRoute.showFormUpdatePokemonTypeName(req, res);
        });
        Main.app.put('/pokemon/types/edit/(:typeId)', (req: any, res: any) => {
           PokemonRoute.updatePokemonTypeName(req, res);
        });
        Main.app.delete('/pokemon/types/edit/(:typeId)', (req: any, res: any) => {
            PokemonRoute.deletePokemonType(req, res);
        });

        Main.app.use('/gyms', (req: any, res: any) => {
            GymsRoute.get(req, res);
        });

        Main.app.listen(3000, function () {
            console.log('Server running at port 3000: http://127.0.0.1:3000');
        });
    }
}
new Main();
