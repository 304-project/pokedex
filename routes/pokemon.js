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
    PokemonRoute.doDivisionQuery = function (req, res) {
        var query2 = "SELECT x.pokedexId, pokemon.name, pokemon.height, pokemon.weight FROM evolvesinto x JOIN pokemon ON x.pokedexId = pokemon.pokedexId, (SELECT * FROM `evolvesinto` WHERE pokedexId = " + req.body.pokedexId + " GROUP BY evolutionChainId) y " +
            "WHERE x.evolutionChainId = y.evolutionChainId AND x.pokedexId > " + req.body.pokedexId;
        app_1.default.connection.query(query2, function (err, rows, fields) {
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
                    loggedInUser: app_1.default.loggedInUser.getJson(),
                    division: true
                });
            }
        });
    };
    PokemonRoute.showDivisionForm = function (req, res) {
        var usedQuery = "select * from pokemon";
        app_1.default.connection.query(usedQuery, function (err, rows, fields) {
            res.render('pokemon/division', {
                title: 'Evolution search (division query)',
                typeId: req.params.typeId,
                typeName: req.params.typeName,
                data: rows,
                loggedInUser: app_1.default.loggedInUser.getJson()
            });
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
    PokemonRoute.showEvaluatePokemonForm = function (req, res) {
        res.render('pokemon/evaluate', {
            title: 'Pokemon',
            filterNameDropMaxMin: '',
            filterNameDropAndOr: '',
            filterNameVal: '',
            filterNameCheck: '',
            filterTypeDropMaxMin: '',
            filterTypeDropAndOr: '',
            filterTypeVal: '',
            filterTypeCheck: '',
            filterIdDropMaxMin: '',
            filterIdDropAndOr: '',
            filterIdVal: '',
            filterIdCheck: '',
            filterHabitatDropMaxMin: '',
            filterHabitatDropAndOr: '',
            filterHabitatVal: '',
            filterHabitatCheck: '',
            filterHeightDropMaxMin: '',
            filterHeightDropAndOr: '',
            filterHeightVal: '',
            filterHeightCheck: '',
            filterWeightDropMaxMin: '',
            filterWeightDropAndOr: '',
            filterWeightVal: '',
            filterWeightCheck: '',
            idColumn: '',
            nameColumn: '',
            heightColumn: '',
            weightColumn: '',
            typeColumn: '',
            habitatColumn: '',
            evolvesIntoColumn: '',
            groupEval: '',
            groupBy: '',
            groupValue: '',
            sortDirection: '',
            sortValue: '',
            loggedInUser: app_1.default.loggedInUser.getJson()
        });
    };
    PokemonRoute.evaluatePokemon = function (req, res) {
        var usedQuery = "";
        var tempval = req.body.groupValue;
        var tempval2 = req.body.groupBy;
        var tempval3 = req.body.groupEval + '(sub.' + tempval2 + ')';
        var tempsortValue = req.body.sortValue;
        var tempval4 = tempval2;
        var filterVal = {
            nameDropMaxMin: req.body.filterNameDropMaxMin,
            nameDropAndOr: req.body.filterNameDropAndOr,
            nameVal: req.body.filterNameVal,
            nameCheck: req.body.filterNameCheck,
            typeNameDropMaxMin: req.body.filterTypeDropMaxMin,
            typeNameDropAndOr: req.body.filterTypeDropAndOr,
            typeNameVal: req.body.filterTypeVal,
            typeNameCheck: req.body.filterTypeCheck,
            pokedexIdDropMaxMin: req.body.filterIdDropMaxMin,
            pokedexIdDropAndOr: req.body.filterIdDropAndOr,
            pokedexIdVal: req.body.filterIdVal,
            pokedexIdCheck: req.body.filterIdCheck,
            identifierDropMaxMin: req.body.filterHabitatDropMaxMin,
            identifierDropAndOr: req.body.filterHabitatDropAndOr,
            identifierVal: req.body.filterHabitatVal,
            identifierCheck: req.body.filterHabitatCheck,
            HeightDropMaxMin: req.body.filterHeightDropMaxMin,
            HeightDropAndOr: req.body.filterHeightDropAndOr,
            HeightVal: req.body.filterHeightVal,
            HeightCheck: req.body.filterHeightCheck,
            WeightDropMaxMin: req.body.filterWeightDropMaxMin,
            WeightDropAndOr: req.body.filterWeightDropAndOr,
            WeightVal: req.body.filterWeightVal,
            WeightCheck: req.body.filterWeightCheck,
            pokedexIdColumn: req.body.idColumn,
            nameColumn: req.body.nameColumn,
            heightColumn: req.body.heightColumn,
            weightColumn: req.body.weightColumn,
            typeNameColumn: req.body.typeColumn,
            identifierColumn: req.body.habitatColumn,
            evolvesIntoColumn: req.body.evolvesIntoColumn
        };
        var filterQuery = pq.buildfilterQuery(query, filterVal);
        if (tempval === 'Type') {
            tempval = 'typeName';
        }
        else if (tempval === 'Habitat') {
            tempval = 'identifier';
        }
        if (tempval2 === 'Type') {
            tempval2 = 'typeName';
        }
        else if (tempval2 === 'Habitat') {
            tempval2 = 'identifier';
        }
        if (req.body.groupValue === req.body.groupBy) {
            tempval2 = 'pokedexId';
            tempval4 = tempval2;
        }
        var groupQuery = 'select ' + req.body.groupEval + '(gsub.' + tempval2 + ') as ' + req.body.groupEval + ',gsub.' + tempval + ' from (' + filterQuery + ') gsub group by gsub.' + tempval;
        if ((req.body.groupEval === "") || !(req.body.groupValue)) {
            usedQuery = filterQuery;
        }
        else {
            usedQuery = groupQuery;
        }
        if ((tempsortValue != 'typeName') && (tempsortValue != 'Habitat') && (req.body.groupEval !== "")) {
            tempsortValue = req.body.groupEval;
            tempval3 = tempsortValue;
        }
        var sortQuery = 'select sub.* from (' + usedQuery + ') sub order by sub.' + tempsortValue + ' ' + req.body.sortDirection;
        if (req.body.sortDirection === "" || !(req.body.sortValue)) {
        }
        else {
            usedQuery = sortQuery;
        }
        console.log("im here");
        console.log("im here");
        console.log("im here");
        console.log(tempsortValue);
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
                    groupEval: req.body.groupEval + '(' + tempval2 + ')',
                    subGroupEval: tempval3,
                    data: rows,
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
            else {
                var q = JSON.stringify(usedQuery);
                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    query: usedQuery,
                    data: rows,
                    loggedInUser: app_1.default.loggedInUser.getJson()
                });
            }
        });
    };
    PokemonRoute.getColumns = function (req, reqBody) {
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