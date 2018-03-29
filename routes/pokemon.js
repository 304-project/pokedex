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
            groupBy: '',
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
        else { }
        var tempval2 = req.body.groupBy;
        if (tempval2 === 'Type') {
            tempval2 = 'typeName';
        }
        else if (tempval2 === 'Habitat') {
            tempval2 = 'identifier';
        }
        else { }
        if (req.body.groupValue === req.body.groupBy) {
            tempval2 = "pokedexID";
        }
        var groupQuery = 'select ' + req.body.groupEval + '(gsub.' + tempval2 + ') as ' + req.body.groupEval + ',gsub.' + tempval + ' from (' + query + ') gsub group by gsub.' + tempval;
        if ((req.body.groupEval === "") || !(req.body.groupValue)) {
            usedQuery = query;
        }
        else {
            usedQuery = groupQuery;
        }
        var tempval3 = req.body.groupEval + '(sub.' + tempval2 + ')';
        var tempsortValue = req.body.sortValue;
        if ((tempsortValue != 'typeName') && (tempsortValue != 'Habitat')) {
            tempsortValue = req.body.groupEval;
            tempval3 = tempsortValue;
        }
        console.log("im here");
        console.log("im here");
        console.log("tempsortvalue");
        console.log(tempsortValue);
        var sortQuery = 'select sub.* from (' + usedQuery + ') sub order by sub.' + tempsortValue + ' ' + req.body.sortDirection;
        if (req.body.sortDirection === "" || !(req.body.sortValue)) {
        }
        else {
            usedQuery = sortQuery;
        }
        console.log("im here");
        console.log("im here");
        console.log("im here");
        console.log(usedQuery);
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
                    groupEval: req.body.groupEval + '(' + req.body.groupBy + ')',
                    subGroupEval: tempval3,
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