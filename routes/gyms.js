"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var query = 'select g.leader, r.identifier, g.locationName, t.typeName, g.badge from gym g join regions r on g.regionId = r.regionId join typeslist t on t.typeId = g.typeId';
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
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
            else {
                res.render('gyms/list', {
                    title: 'Gyms List',
                    data: rows,
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
        });
    };
    GymsRoute.search = function (req, res) {
    };
    return GymsRoute;
}());
exports.GymsRoute = GymsRoute;
//# sourceMappingURL=gyms.js.map