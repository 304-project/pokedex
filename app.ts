import config from "./config";
let express = require('express');
let mysql = require('mysql');

/**
 * This middleware provides a consistent API
 * for MySQL connections during request/response life cycle
 */
let myConnection  = require('express-myconnection');


export default class Main {
    public static app = express();
    constructor(){
        /**
         * Store database credentials in a separate config.js file
         * L
         oad the file/module and its values
         */

        let dbOptions = {
            host:	  config.database.host,
            user: 	  config.database.user,
            password: config.database.password,
            port: 	  config.database.port,
            database: config.database.db
        };

        /**
         * 3 strategies can be used
         * single: Creates single database connection which is never closed.
         * pool: Creates pool of connections. Connection is auto release when response ends.
         * request: Creates new connection per new request. Connection is auto close when response ends.
         */

        Main.app.use(myConnection(mysql, dbOptions, 'pool'));

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
        Main.app.use(bodyParser.urlencoded({ extended: true }));
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
        Main.app.use(methodOverride(function (req, res) {
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
            cookie: { maxAge: 60000 }
        }));
        Main.app.use(flash());

        /**
         * import routes/index.js
         * import routes/users.js
         */
        let index = require('./routes/index');
        let users = require('./routes/users');
        let pokemon = require('./routes/pokemon');

        Main.app.use('/', index);
        Main.app.use('/users', users);
        Main.app.use('/pokemon', pokemon);

        Main.app.listen(3000, function(){
            console.log('Server running at port 3000: http://127.0.0.1:3000');
        });
    }
}
new Main();



