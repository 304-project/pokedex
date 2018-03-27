"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var PokemonRoute = (function () {
    function PokemonRoute() {
    }
    PokemonRoute.get = function (req, res) {
        app_1.default.connection.query('SELECT * FROM pokemon', function (err, rows, fields) {
            if (err) {
                req.flash('error', err);
                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    data: '',
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
            else {
                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    data: rows,
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
        });
    };
    PokemonRoute.search = function (req, res) {
    };
    return PokemonRoute;
}());
exports.PokemonRoute = PokemonRoute;
//# sourceMappingURL=pokemon.js.map