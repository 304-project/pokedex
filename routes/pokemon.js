"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var origQuery = 'select p.pokedexId, p.name, p.height, p.weight, h.identifier, t.typeName from pokemon p join pokemontypes pt on p.pokedexId = pt.pokedexId join habitats h on p.habitatId = h.habitatId join typeslist t on pt.typeId = t.typeId';
var query = origQuery;
var sort = ' order by p.pokedexId asc';
var PokemonRoute = (function () {
    function PokemonRoute() {
    }
    PokemonRoute.get = function (req, res) {
        req.assert('name', 'Name is required').notEmpty();
        var errors = req.validationErrors();
        if (!errors) {
            var searchPokemon = {
                name: req.sanitize('name').escape().trim(),
            };
            var searchId = {
                name: req.sanitize('name').escape().trim(),
            };
            var searchId = {
                name: req.sanitize('name').escape().trim(),
            };
            var searchId = {
                name: req.sanitize('name').escape().trim(),
            };
            query += " where " + +searchPokemon + "'";
        }
        else {
            query = origQuery;
        }
        app_1.default.connection.query(query, function (err, rows, fields) {
            if (err) {
                req.flash('error', err);
                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    data: '',
                    id: '',
                    name: '',
                    type: '',
                    habitat: '',
                    query: '',
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
            else {
                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    data: rows,
                    id: '',
                    name: '',
                    type: '',
                    habitat: '',
                    query: '',
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
        });
    };
    return PokemonRoute;
}());
exports.PokemonRoute = PokemonRoute;
//# sourceMappingURL=pokemon.js.map