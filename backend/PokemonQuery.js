"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var util_1 = require("util");
var PokemonQuery = (function () {
    function PokemonQuery() {
        this.columns = null;
        this.from = null;
        this.where = null;
        this.group = null;
        this.sortAttributes = null;
        this.sortOrder = null;
    }
    PokemonQuery.prototype.setAndParseReqBody = function (reqBody) {
        this.reqBody = reqBody;
        this.parseAll();
    };
    PokemonQuery.prototype.setNestedInnerQuery = function (nestedQuery) {
        this.from = ["(" + nestedQuery.buildSqlQuery() + ")"];
    };
    PokemonQuery.prototype.buildSqlQuery = function () {
        var sql = "";
        if (!util_1.isNull(this.columns)) {
            sql += 'SELECT ' + this.columns;
        }
        if (!util_1.isNull(this.from)) {
            sql += ' FROM ' + this.from;
        }
        if (!util_1.isNull(this.where)) {
            sql += ' WHERE ' + this.where;
        }
        if (!util_1.isNull(this.group)) {
            sql += ' GROUP BY ' + this.group;
        }
        if (!util_1.isNull(this.sortAttributes)) {
            sql += ' ORDER BY ' + this.sortAttributes;
        }
        if (!util_1.isNull(this.sortOrder)) {
            sql += ' ' + this.sortOrder;
        }
        return sql;
    };
    PokemonQuery.prototype.buildfilterQuery = function (query, filterval) {
        var sql = "";
        var thiscolumn = "";
        for (var key in filterval) {
            if (filterval.hasOwnProperty(key)) {
                if ((key.indexOf("Column") > 0) && (filterval[key] != undefined)) {
                    var item_1 = key.substr(0, key.indexOf("Column"));
                    thiscolumn += 'fsub.' + item_1 + ', ';
                }
            }
        }
        var temp = "";
        if (thiscolumn != "") {
            sql += 'SELECT ' + thiscolumn.substr(0, thiscolumn.length - 2);
        }
        else {
            sql += 'SELECT fsub.*';
        }
        sql += ' FROM (' + query + ') fsub';
        var thiswhere = "";
        var cond = "";
        var item = "";
        for (var key in filterval) {
            if (filterval.hasOwnProperty(key)) {
                if ((key.indexOf("Val") > 0) && (filterval[key] != "")) {
                    item = key.substr(0, key.indexOf("Val"));
                    if ((filterval[item + 'DropAndOr'] != "") && (filterval[item + 'DropAndOr'] != undefined)) {
                        cond = filterval[item + "DropAndOr"];
                        thiswhere += 'fsub.' + item + ' = ' + "'" + filterval[key] + "'" + ' ' + cond + ' ';
                    }
                    else {
                        thiswhere += 'fsub.' + item + ' = ' + "'" + filterval[key] + "'";
                    }
                }
            }
        }
        if (thiswhere == "") {
        }
        else {
            sql += ' WHERE ' + thiswhere;
        }
        if ((thiscolumn == "") && (thiswhere == "")) {
            return query;
        }
        else {
            return sql;
        }
    };
    PokemonQuery.prototype.parseAll = function () {
        this.parseColumns();
        this.parseFrom();
        this.parseWhere();
        this.parseGroup();
        this.parseSortOrder();
        this.parseSortAttributes();
    };
    PokemonQuery.prototype.parseColumns = function () {
        if (this.reqBody.hasOwnProperty('columns')) {
            this.columns = this.reqBody.columns;
        }
    };
    PokemonQuery.prototype.parseFrom = function () {
        if (this.reqBody.hasOwnProperty('from')) {
            this.from = this.reqBody.from;
        }
    };
    PokemonQuery.prototype.parseGroup = function () {
        if (this.reqBody.hasOwnProperty('group')) {
            this.group = this.reqBody.group;
        }
    };
    PokemonQuery.prototype.parseWhere = function () {
        if (this.reqBody.hasOwnProperty('where')) {
            this.where = this.reqBody.where;
        }
    };
    PokemonQuery.prototype.parseSortAttributes = function () {
        if (this.reqBody.hasOwnProperty('sortAttributes')) {
            this.sortAttributes = this.reqBody.sortAttributes;
        }
    };
    PokemonQuery.prototype.parseSortOrder = function () {
        if (this.reqBody.hasOwnProperty('sortOrder')) {
            this.sortOrder = this.reqBody.sortOrder;
        }
    };
    PokemonQuery.prototype.runQuery = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            var sqlQuery = that.buildSqlQuery();
            app_1.default.connection.query(sqlQuery, function (err, rows, fields) {
                return resolve(rows);
            });
        });
    };
    return PokemonQuery;
}());
exports.default = PokemonQuery;
//# sourceMappingURL=PokemonQuery.js.map