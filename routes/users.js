"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var UsersRoute = (function () {
    function UsersRoute() {
    }
    UsersRoute.showUsers = function (req, res) {
        var sql = 'SELECT * FROM users ORDER BY id DESC';
        app_1.default.connection.query(sql, function (err, rows, fields) {
            if (err) {
                req.flash('error', err);
                res.render('user/list', {
                    title: 'User List',
                    data: ''
                });
            }
            else {
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
    UsersRoute.addNewUser = function (req, res) {
        req.assert('name', 'Name is required').notEmpty();
        req.assert('age', 'Age is required').notEmpty();
        req.assert('email', 'A valid email is required').isEmail();
        var errors = req.validationErrors();
        if (!errors) {
            var user = {
                name: req.sanitize('name').escape().trim(),
                age: req.sanitize('age').escape().trim(),
                email: req.sanitize('email').escape().trim()
            };
            req.getConnection(function (error, conn) {
                conn.query('INSERT INTO users SET ?', user, function (err, result) {
                    if (err) {
                        req.flash('error', err);
                        res.render('user/add', {
                            title: 'Add New User',
                            name: user.name,
                            age: user.age,
                            email: user.email
                        });
                    }
                    else {
                        req.flash('success', 'Data added successfully!');
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
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id);
                res.redirect('/users');
            }
            else {
                res.render('user/edit', {
                    title: 'Edit User',
                    id: rows[0].id,
                    name: rows[0].name,
                    age: rows[0].age,
                    email: rows[0].email
                });
            }
        });
    };
    UsersRoute.editUser = function (req, res) {
        req.assert('name', 'Name is required').notEmpty();
        req.assert('age', 'Age is required').notEmpty();
        req.assert('email', 'A valid email is required').isEmail();
        var errors = req.validationErrors();
        if (!errors) {
            var user = {
                name: req.sanitize('name').escape().trim(),
                age: req.sanitize('age').escape().trim(),
                email: req.sanitize('email').escape().trim()
            };
            app_1.default.connection.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function (err, result) {
                if (err) {
                    req.flash('error', err);
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
            if (err) {
                req.flash('error', err);
                res.redirect('/users');
            }
            else {
                req.flash('success', 'User deleted successfully! id = ' + req.params.id);
                res.redirect('/users');
            }
        });
    };
    return UsersRoute;
}());
exports.UsersRoute = UsersRoute;
//# sourceMappingURL=users.js.map