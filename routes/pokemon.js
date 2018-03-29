"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var query = 'select p.pokedexId, p.name, p.height, p.weight, h.identifier, t.typeName from pokemon p join typeslist t on p.typeId = t.typeId join habitats h on p.habitatId = h.habitatId ORDER BY p.pokedexId ASC';
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
    PokemonRoute.managePokemonTypes = function (req, res) {
        var query = "SELECT * FROM typeslist ORDER BY typeId ASC";
        app_1.default.connection.query(query, function (err, rows, fields) {
            if (err) {
                req.flash('error', err);
                res.render('pokemon/types/list', {
                    title: 'Pokemon Types List',
                    data: '',
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
            else {
                res.render('pokemon/types/list', {
                    title: 'Pokemon Types List',
                    data: rows,
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
        });
    };
    PokemonRoute.deletePokemonType = function (req, res) {
        var sql = 'DELETE FROM typeslist WHERE typeId = ' + req.params.typeId;
        app_1.default.connection.query(sql, function (err, result) {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/pokemon/types');
            }
            else {
                req.flash('success', 'Pokemon type and associated Pokemon deleted!');
                res.redirect('/pokemon/types');
            }
        });
    };
    PokemonRoute.updatePokemonTypeName = function (req, res) {
        var sql1 = 'SELECT * FROM typeslist WHERE typeName = "' + req.body.typeName + '"';
        app_1.default.connection.query(sql1, function (err, result) {
            if (err) {
                req.flash('error', err);
                res.redirect('/pokemon/types');
            }
            else {
                if (result.length == 0) {
                    var sql = 'UPDATE typeslist SET typeName = "' + req.body.typeName + '" WHERE typeId = ' + req.params.typeId;
                    app_1.default.connection.query(sql, function (err, result) {
                        if (err) {
                            req.flash('error', err);
                            res.redirect('/pokemon/types');
                        }
                        else {
                            req.flash('success', 'Type updated successfully!');
                            res.redirect('/pokemon/types');
                        }
                    });
                }
                else {
                    req.flash('error', 'CONSTRAINT VIOLATED: Unable to change Pokemon type name to an existing name');
                    res.redirect('/pokemon/types');
                }
            }
        });
    };
    PokemonRoute.showFormUpdatePokemonTypeName = function (req, res) {
        res.render('pokemon/types/edit', {
            title: 'Edit Pokemon Type',
            typeId: req.params.typeId,
            typeName: req.params.typeName,
            loggedInUser: app_1.default.loggedInUser.getJson()
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
//# sourceMappingURL=pokemon.js.map