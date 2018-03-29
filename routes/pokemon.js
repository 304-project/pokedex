"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var query = 'select p.pokedexId, p.name, p.height, p.weight, h.identifier, t.typeName from pokemon p join typeslist t on p.typeId = t.typeId join habitats h on p.habitatId = h.habitatId order by p.pokedexId asc';
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
        res.render('pokemon/evaluate', {
            title: 'Pokemon',
            filterName: '',
            filterType: '',
            filterId: '',
            filterHabitat: '',
            filterHeight: '',
            filterHeight1: '',
            filterHeight2: '',
            filterWeight: '',
            filterWeight1: '',
            filterWeight2: '',
            groupEval: '',
            groupValue: '',
            sortDirection: '',
            sortValue: '',
            loggedInUser: app_1.default.loggedInUser.getJson()
        });
    };
    PokemonRoute.evaluatePokemon = function (req, res) {
        var usedQuery = null;
        var tempval = req.body.groupValue;
        if (tempval === 'Type') {
            tempval = 'typeName';
        }
        else if (tempval === 'Habitat') {
            tempval = 'identifier';
        }
        else if (tempval === 'Region') {
            tempval = 'identifier';
        }
        else { }
        var groupQuery = 'select ' + req.body.groupEval + '(sub.pokedexId),sub.' + tempval + ' from (' + query + ') sub group by sub.' + tempval;
        if ((req.body.groupEval === "") || !(req.body.groupValue)) {
            usedQuery = query;
        }
        else {
            usedQuery = groupQuery;
        }
        console.log("im here");
        console.log("im here");
        console.log("im here");
        console.log(usedQuery);
        var sortQuery = 'select sub.* from (' + usedQuery + ') sub order by sub.' + req.body.sortValue + ' ' + req.body.sortDirection;
        if (req.body.sortDirection === "" || !(req.body.sortValue)) {
        }
        else {
            usedQuery = sortQuery;
        }
        app_1.default.connection.query(usedQuery, function (err, rows, fields) {
            if (err) {
                req.flash('error', err);
                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    data: '',
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
            else if (!(req.body.groupEval === "") && (req.body.groupValue)) {
                res.render('pokemon/group', {
                    title: 'Pokemon List',
                    groupValue: req.body.groupValue,
                    groupHeader: tempval,
                    groupEval: req.body.groupEval + '(pokedexId)',
                    subGroupEval: req.body.groupEval + '(sub.pokedexId)',
                    data: rows,
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