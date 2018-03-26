"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
// SHOW LIST OF USERS
var UsersRoute = /** @class */ (function () {
    function UsersRoute() {
    }
    UsersRoute.showUsers = function (req, res) {
        var sql = 'SELECT * FROM users ORDER BY id DESC';
        app_1.default.connection.query(sql, function (err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err);
                res.render('user/list', {
                    title: 'User List',
                    data: ''
                });
            }
            else {
                // render to views/user/list.ejs template file
                res.render('user/list', {
                    title: 'User List',
                    data: rows
                });
            }
        });
    };
    UsersRoute.showAddUserForm = function (req, res) {
        res.render('user/add', {
            title: 'Add New User',
            name: '',
            age: '',
            email: ''
        });
    };
    // ADD NEW USER POST ACTION
    UsersRoute.addNewUser = function (req, res) {
        req.assert('name', 'Name is required').notEmpty(); //Validate name
        req.assert('age', 'Age is required').notEmpty(); //Validate age
        req.assert('email', 'A valid email is required').isEmail(); //Validate email
        var errors = req.validationErrors();
        if (!errors) {
            /********************************************
             * Express-validator module

             req.body.comment = 'a <span>comment</span>';
             req.body.username = '   a user    ';

             req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
             req.sanitize('username').trim(); // returns 'a user'
             ********************************************/
            var user = {
                name: req.sanitize('name').escape().trim(),
                age: req.sanitize('age').escape().trim(),
                email: req.sanitize('email').escape().trim()
            };
            req.getConnection(function (error, conn) {
                conn.query('INSERT INTO users SET ?', user, function (err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash('error', err);
                        // render to views/user/add.ejs
                        res.render('user/add', {
                            title: 'Add New User',
                            name: user.name,
                            age: user.age,
                            email: user.email
                        });
                    }
                    else {
                        req.flash('success', 'Data added successfully!');
                        // render to views/user/add.ejs
                        res.render('user/add', {
                            title: 'Add New User',
                            name: '',
                            age: '',
                            email: ''
                        });
                    }
                });
            });
        }
        else {
            var error_msg = '';
            errors.forEach(function (error) {
                error_msg += error.msg + '<br>';
            });
            req.flash('error', error_msg);
            /**
             * Using req.body.name
             * because req.param('name') is deprecated
             */
            res.render('user/add', {
                title: 'Add New User',
                name: req.body.name,
                age: req.body.age,
                email: req.body.email
            });
        }
    };
    UsersRoute.showEditUserForm = function (req, res) {
        app_1.default.connection.query('SELECT * FROM users WHERE id = ' + req.params.id, function (err, rows, fields) {
            if (err)
                throw err;
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id);
                res.redirect('/users');
            }
            else {
                // render to views/user/edit.ejs template file
                res.render('user/edit', {
                    title: 'Edit User',
                    //data: rows[0],
                    id: rows[0].id,
                    name: rows[0].name,
                    age: rows[0].age,
                    email: rows[0].email
                });
            }
        });
    };
    // EDIT USER POST ACTION
    UsersRoute.editUser = function (req, res) {
        req.assert('name', 'Name is required').notEmpty(); //Validate name
        req.assert('age', 'Age is required').notEmpty(); //Validate age
        req.assert('email', 'A valid email is required').isEmail(); //Validate email
        var errors = req.validationErrors();
        if (!errors) {
            /********************************************
             * Express-validator module

             req.body.comment = 'a <span>comment</span>';
             req.body.username = '   a user    ';

             req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
             req.sanitize('username').trim(); // returns 'a user'
             ********************************************/
            var user = {
                name: req.sanitize('name').escape().trim(),
                age: req.sanitize('age').escape().trim(),
                email: req.sanitize('email').escape().trim()
            };
            app_1.default.connection.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function (err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err);
                    // render to views/user/add.ejs
                    res.render('user/edit', {
                        title: 'Edit User',
                        id: req.params.id,
                        name: req.body.name,
                        age: req.body.age,
                        email: req.body.email
                    });
                }
                else {
                    req.flash('success', 'Data updated successfully!');
                    // render to views/user/add.ejs
                    res.render('user/edit', {
                        title: 'Edit User',
                        id: req.params.id,
                        name: req.body.name,
                        age: req.body.age,
                        email: req.body.email
                    });
                }
            });
        }
        else {
            var error_msg = '';
            errors.forEach(function (error) {
                error_msg += error.msg + '<br>';
            });
            req.flash('error', error_msg);
            /**
             * Using req.body.name
             * because req.param('name') is deprecated
             */
            res.render('user/edit', {
                title: 'Edit User',
                id: req.params.id,
                name: req.body.name,
                age: req.body.age,
                email: req.body.email
            });
        }
    };
    UsersRoute.deleteUser = function (req, res) {
        var user = { id: req.params.id };
        app_1.default.connection.query('DELETE FROM users WHERE id = ' + req.params.id, user, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err);
                // redirect to users list page
                res.redirect('/users');
            }
            else {
                req.flash('success', 'User deleted successfully! id = ' + req.params.id);
                // redirect to users list page
                res.redirect('/users');
            }
        });
    };
    return UsersRoute;
}());
exports.UsersRoute = UsersRoute;
