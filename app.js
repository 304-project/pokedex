"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var users_1 = require("./routes/users");
var pokemon_1 = require("./routes/pokemon");
var index_1 = require("./routes/index");
var express = require('express');
var mysql = require('mysql');
var myConnection = require('express-myconnection');
var Main = (function () {
    function Main() {
        Main.app.use(myConnection(mysql, Main.dbOptions, 'request'));
        Main.app.set('view engine', 'ejs');
        var expressValidator = require('express-validator');
        Main.app.use(expressValidator());
        var bodyParser = require('body-parser');
        Main.app.use(bodyParser.urlencoded({ extended: true }));
        Main.app.use(bodyParser.json());
        var methodOverride = require('method-override');
        Main.app.use(methodOverride(function (req, res) {
            if (req.body && typeof req.body === 'object' && '_method' in req.body) {
                var method = req.body._method;
                delete req.body._method;
                return method;
            }
        }));
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
        Main.app.get('/', function (req, res) { index_1.IndexRoute.getIndex(req, res); });
        Main.app.get('/users', function (req, res) { users_1.UsersRoute.showUsers(req, res); });
        Main.app.get('/users/login', function (req, res) { users_1.UsersRoute.showLoginForm(req, res); });
        Main.app.post('/users/login', function (req, res) { users_1.UsersRoute.login(req, res); });
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
    Main.loggedInUser = null;
    Main.app = express();
    Main.connection = mysql.createConnection(Main.dbOptions);
    return Main;
}());
exports.default = Main;
new Main();
//# sourceMappingURL=app.js.map