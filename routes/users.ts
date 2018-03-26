import Main from '../app';
import * as express from "express"

// SHOW LIST OF USERS

export class UsersRoute {

    public static showUsers(req: any, res: express.Response) {
        let sql: string = 'SELECT * FROM users ORDER BY id DESC';
        Main.connection.query(sql, (err: any, rows: any, fields: any) => {
            //if(err) throw err
            if (err) {
                req.flash('error', err);
                res.render('user/list', {
                    title: 'User List',
                    data: ''
                })
            } else {
                // render to views/user/list.ejs template file
                res.render('user/list', {
                    title: 'User List',
                    data: rows
                })
            }
        });
    }



    public static showAddUserForm(req: any, res: express.Response) {
        res.render('user/add', {
            title: 'Add New User',
            name: '',
            age: '',
            email: ''
        });
    }

    // ADD NEW USER POST ACTION
    public static addNewUser(req: any, res: express.Response) {
        req.assert('name', 'Name is required').notEmpty();           //Validate name
        req.assert('age', 'Age is required').notEmpty();             //Validate age
        req.assert('email', 'A valid email is required').isEmail();  //Validate email

        var errors = req.validationErrors();

        if (!errors) {   //No errors were found.  Passed Validation!

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

            req.getConnection(function (error: any, conn: any) {
                conn.query('INSERT INTO users SET ?', user, function (err: any, result: any) {
                    //if(err) throw err
                    if (err) {
                        req.flash('error', err);

                        // render to views/user/add.ejs
                        res.render('user/add', {
                            title: 'Add New User',
                            name: user.name,
                            age: user.age,
                            email: user.email
                        })
                    } else {
                        req.flash('success', 'Data added successfully!');

                        // render to views/user/add.ejs
                        res.render('user/add', {
                            title: 'Add New User',
                            name: '',
                            age: '',
                            email: ''
                        })
                    }
                })
            })
        }
        else {   //Display errors to user
            var error_msg = '';
            errors.forEach(function (error: any) {
                error_msg += error.msg + '<br>'
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
            })
        }
    }


    public static showEditUserForm(req: any, res: express.Response) {
        Main.connection.query('SELECT * FROM users WHERE id = ' + req.params.id, function (err: any, rows: any, fields: any) {
            if (err) throw err;

            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id);
                res.redirect('/users')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render('user/edit', {
                    title: 'Edit User',
                    //data: rows[0],
                    id: rows[0].id,
                    name: rows[0].name,
                    age: rows[0].age,
                    email: rows[0].email
                })
            }
        })
    }

    // EDIT USER POST ACTION
    public static editUser(req: any, res: express.Response) {
        req.assert('name', 'Name is required').notEmpty();           //Validate name
        req.assert('age', 'Age is required').notEmpty();             //Validate age
        req.assert('email', 'A valid email is required').isEmail();  //Validate email

        var errors = req.validationErrors();

        if (!errors) {   //No errors were found.  Passed Validation!

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
            Main.connection.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function (err: any, result: any) {
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
                    })
                } else {
                    req.flash('success', 'Data updated successfully!');

                    // render to views/user/add.ejs
                    res.render('user/edit', {
                        title: 'Edit User',
                        id: req.params.id,
                        name: req.body.name,
                        age: req.body.age,
                        email: req.body.email
                    })
                }
            })
        } else {   //Display errors to user
            var error_msg = '';
            errors.forEach(function (error: any) {
                error_msg += error.msg + '<br>'
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
            })
        }
    }

    public static deleteUser(req: any, res: express.Response) {
        var user = {id: req.params.id};
        Main.connection.query('DELETE FROM users WHERE id = ' + req.params.id, user, function (err: any, result: any) {
            //if(err) throw err
            if (err) {
                req.flash('error', err);
                // redirect to users list page
                res.redirect('/users')
            } else {
                req.flash('success', 'User deleted successfully! id = ' + req.params.id);
                // redirect to users list page
                res.redirect('/users')
            }
        });
    }

}
