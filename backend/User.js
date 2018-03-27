"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var User = (function () {
    function User() {
        this.isLoggedIn = false;
        this.privilegeLevel = 0;
    }
    User.prototype.logout = function () {
        this.isLoggedIn = false;
        this.username = null;
        this.password = null;
        this.age = null;
        this.email = null;
        this.privilegeLevel = 0;
    };
    User.prototype.getJson = function () {
        var toRtn = JSON.stringify(this);
        return JSON.stringify(this);
    };
    User.prototype.logIn = function (username, password) {
        var sql = "SELECT * FROM users " +
            "WHERE name = \"" + username + "\" AND password = \"" + password + "\"";
        var that = this;
        return new Promise(function (resolve, reject) {
            app_1.default.connection.query(sql, function (err, rows, fields) {
                if (err) {
                    console.log("ERROR: " + err.message.toString());
                }
                else {
                    if (rows.length > 0) {
                        console.log("Login successful");
                        that.username = username;
                        that.password = password;
                        that.privilegeLevel = rows[0].privilegeLevel;
                        that.email = rows[0].email;
                        that.age = rows[0].age;
                        that.isLoggedIn = true;
                    }
                    else {
                        console.log("Incorrect username or password");
                    }
                }
                return resolve(that.isLoggedIn);
            });
        });
    };
    return User;
}());
exports.default = User;
//# sourceMappingURL=User.js.map