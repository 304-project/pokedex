"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var users_1 = require("./routes/users");
var pokemon_1 = require("./routes/pokemon");
var index_1 = require("./routes/index");
var express = require('express');
var mysql = require('mysql');
/**
 * This middleware provides a consistent API
 * for MySQL connections during request/response life cycle
 */
var myConnection = require('express-myconnection');
var Main = /** @class */ (function () {
    function Main() {
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
        var expressValidator = require('express-validator');
        Main.app.use(expressValidator());
        /**
         * body-parser module is used to read HTTP POST data
         * it's an express middleware that reads form's input
         * and store it as javascript object
         */
        var bodyParser = require('body-parser');
        /**
         * bodyParser.urlencoded() parses the text as URL encoded data
         * (which is how browsers tend to send form data from regular forms set to POST)
         * and exposes the resulting object (containing the keys and values) on req.body.
         */
        Main.app.use(bodyParser.urlencoded({ extended: true }));
        Main.app.use(bodyParser.json());
        /**
         * This module let us use HTTP verbs such as PUT or DELETE
         * in places where they are not supported
         */
        var methodOverride = require('method-override');
        /**
         * using custom logic to override method
         *
         * there are other ways of overriding as well
         * like using header & using query value
         */
        Main.app.use(methodOverride(function (req, res) {
            if (req.body && typeof req.body === 'object' && '_method' in req.body) {
                // look in urlencoded POST bodies and delete it
                var method = req.body._method;
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
        var flash = require('express-flash');
        var cookieParser = require('cookie-parser');
        var session = require('express-session');
        Main.app.use(cookieParser('keyboard cat'));
        Main.app.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 60000 }
        }));
        Main.app.use(flash());
        /**
         * import routes/index.js
         * import routes/users.js
         */
        // let index = require('./routes/index');
        // let pokemon = require('./routes/pokemon');
        // Main.app.use('/', index);
        Main.app.get('/', function (req, res) { index_1.IndexRoute.getIndex(req, res); });
        // Main.app.use('/users', users);
        Main.app.get('/users', function (req, res) { users_1.UsersRoute.showUsers(req, res); });
        Main.app.get('/users/add', function (req, res) { users_1.UsersRoute.showAddUserForm(req, res); });
        Main.app.post('/users/add', function (req, res) { users_1.UsersRoute.addNewUser(req, res); });
        Main.app.get('/users/edit/(:id)', function (req, res) { users_1.UsersRoute.showEditUserForm(req, res); });
        Main.app.put('/users/edit/(:id)', function (req, res) { users_1.UsersRoute.editUser(req, res); });
        Main.app.delete('/users/delete/(:id)', function (req, res) { users_1.UsersRoute.deleteUser(req, res); });
        Main.app.use('/pokemon', function (req, res) { pokemon_1.PokemonRoute.get(req, res); });
        Main.app.listen(3000, function () {
            console.log('Server running at port 3000: http://127.0.0.1:3000');
        });
    }
    Main.dbOptions = {
        host: config_1.default.database.host,
        user: config_1.default.database.user,
        password: config_1.default.database.password,
        port: config_1.default.database.port,
        database: config_1.default.database.db
    };
    Main.app = express();
    Main.connection = mysql.createConnection(Main.dbOptions);
    return Main;
}());
exports.default = Main;
new Main();
