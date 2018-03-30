"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var PokemonQuery_1 = require("../backend/PokemonQuery");
var origJoin = 'pokemon p join typeslist t on p.typeId = t.typeId join habitats h on p.habitatId = h.habitatId join evolvesinto e on p.pokedexId = e.evolvesFromId join pokemon p2 on p2.pokedexId = e.pokedexId';
var origColumns = 'p.pokedexId, p.name, p.height, p.weight, identifier, typeName, p2.name as evolvesInto';
var origSort = 'p.pokedexId';
var origSortOrder = 'asc';
var columnMap = {
    nameColumn: 'p.name',
    idColumn: 'p.pokedexId',
    typeColumn: 'typeName',
    heightColumn: 'p.height',
    weightColumn: 'p.weight',
    habitatColumn: 'identifier',
    evolvesIntoColumn: 'p2.name'
};
var origBody = { 'columns': origColumns, 'from': origJoin, 'sortAttributes': origSort, 'sortOrder': origSortOrder };
var pq = new PokemonQuery_1.default();
pq.setAndParseReqBody(origBody);
var query = pq.buildSqlQuery();
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
            idColumn: false,
            nameColumn: false,
            heightColumn: false,
            weightColumn: false,
            typeColumn: false,
            habitatColumn: false,
            evolvesIntoColumn: false,
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
        var reqBody = { columns: '', from: '' };
        if (tempval === 'Type') {
            tempval = 'typeName';
        }
        else if (tempval === 'Habitat') {
            tempval = 'identifier';
        }
        else { }
        var tempval2 = req.body.groupBy;
        var tempval4 = tempval2;
        if (tempval2 === 'Type') {
            tempval2 = 'typeName';
        }
        else if (tempval2 === 'Habitat') {
            tempval2 = 'identifier';
        }
        else { }
        if (req.body.groupValue === req.body.groupBy) {
            tempval2 = 'pokedexId';
            tempval4 = tempval2;
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
        var sortQuery = 'select sub.* from (' + usedQuery + ') sub order by sub.' + tempsortValue + ' ' + req.body.sortDirection;
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
                    groupEval: req.body.groupEval + '(' + tempval2 + ')',
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
    PokemonRoute.prototype.getColumns = function (req, reqBody) {
        for (var i in req.body) {
            if (i.indexOf("Column") > 0) {
                reqBody.columns += columnMap[i] + ", ";
            }
        }
        if (reqBody.columns.length == 0) {
            reqBody.columns = origColumns;
        }
        else {
            reqBody.columns = reqBody.columns.substring(0, reqBody.columns.length - 2);
        }
    };
    PokemonRoute.prototype.getFrom = function (req, reqBody) {
    };
    PokemonRoute.prototype.getWhere = function (req, reqBody) {
    };
    return PokemonRoute;
}());
exports.PokemonRoute = PokemonRoute;
//# sourceMappingURL=pokemon.js.map