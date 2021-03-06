"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var query = 'select g.leader, r.identifier, g.locationName, t.typeName, g.badge from gym g join regions r on g.regionId = r.regionId join typeslist t on t.typeId = g.typeId';
var typeSelect = 'grass';
var queryJoin = 'select p.name, t.typeName, g.badge from pokemon p join typeslist t on t.typeId = p.typeId join gym g on t.typeId = g.typeId where t.typeName = ';
var GymsRoute = (function () {
    function GymsRoute() {
    }
    GymsRoute.get = function (req, res) {
        app_1.default.connection.query(query, function (err, rows, fields) {
            if (err) {
                req.flash('error', err);
                res.render('gyms/list', {
                    title: 'Gyms List',
                    data: '',
                    query: query,
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
            else {
                res.render('gyms/list', {
                    title: 'Gyms List',
                    data: rows,
                    query: query,
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
        });
    };
    GymsRoute.join = function (req, res) {
        var find = req.body.find;
        var qJoin = queryJoin + "'" + find + "'";
        app_1.default.connection.query(qJoin, function (err, rows, fields) {
            if (err) {
                req.flash('error', err);
                res.render('gyms/join', {
                    title: 'Join List',
                    data: '',
                    find: '',
                    query: query,
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
            else {
                res.render('gyms/join', {
                    title: 'Join List',
                    data: rows,
                    query: query,
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
        });
    };
    return GymsRoute;
}());
exports.GymsRoute = GymsRoute;
//# sourceMappingURL=gyms.js.map