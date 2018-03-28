"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var query = 'select p.pokedexId, p.name, p.height, p.weight, h.identifier, t.typeName from pokemon p join pokemontypes pt on p.pokedexId = pt.pokedexId join habitats h on p.habitatId = h.habitatId join typeslist t on pt.typeId = t.typeId';
var PokemonRoute = (function () {
    function PokemonRoute() {
    }
    PokemonRoute.get = function (req, res) {
        app_1.default.connection.query(query, function (err, rows, fields) {
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
    PokemonRoute.showEvaluatePokemonForm = function (req, res) {
        console.log("at least we get here");
        console.log("at least we get here");
        console.log("at least we get here");
        console.log("at least we get here");
        console.log("at least we get here");
        console.log("at least we get here");
        res.render('pokemon/evaluate', {
            title: 'Pokemon Evaluate',
            filterName: '',
            filterType: '',
            filterHabitat: '',
            groupType: '',
            groupHabitat: '',
            groupRegion: '',
            sortId: '',
            sortHeight: '',
            sortWeight: ''
        });
    };
    PokemonRoute.filterPokemon = function (req, res) {
        var temp = null;
        var filterQuery = 'SELECT * FROM pokemon WHERE ';
        app_1.default.connection.query(query, function (err, rows, fields) {
            if (err) {
                req.flash('error', err);
            }
            else {
                app_1.default.connection.query(query, function (err, rows, fields) {
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
            }
        });
    };
    PokemonRoute.sortPokemon = function (req, res) {
        app_1.default.connection.query(query, function (err, rows, fields) {
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
    PokemonRoute.groupPokemon = function (req, res) {
        app_1.default.connection.query(query, function (err, rows, fields) {
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
    return PokemonRoute;
}());
exports.PokemonRoute = PokemonRoute;
//# sourceMappingURL=pokemons.js.map