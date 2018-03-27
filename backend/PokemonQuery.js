"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var util_1 = require("util");
var PokemonQuery = (function () {
    function PokemonQuery(reqBody) {
        this.group = null;
        this.where = null;
        this.sortAttributes = null;
        this.sortOrder = null;
        this.reqBody = reqBody;
        this.parseWhere();
        this.parseGroup();
        this.parseSortOrder();
        this.parseSortAttributes();
    }
    PokemonQuery.prototype.runQuery = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            var sqlQuery = that.buildSqlQuery();
            app_1.default.connection.query(sqlQuery, function (err, rows, fields) {
                return resolve(rows);
            });
        });
    };
    PokemonQuery.prototype.buildSqlQuery = function () {
        var sql = 'SELECT * FROM pokemon';
        if (!util_1.isNull(this.where)) {
            sql += ' WHERE ' + this.where.join(" AND ");
        }
        if (!util_1.isNull(this.group)) {
            sql += ' GROUP BY ' + this.group.join(', ');
        }
        if (!util_1.isNull(this.sortAttributes)) {
            sql += 'ORDER BY ' + this.sortAttributes.join(', ');
        }
        if (!util_1.isNull(this.sortOrder)) {
            sql += ' ' + this.sortOrder;
        }
        return sql;
    };
    PokemonQuery.prototype.parseGroup = function () {
        if (this.reqBody.hasOwnProperty('group')) {
        }
    };
    PokemonQuery.prototype.parseWhere = function () {
        if (this.reqBody.hasOwnProperty('where')) {
        }
    };
    PokemonQuery.prototype.parseSortAttributes = function () {
        if (this.reqBody.hasOwnProperty('sortAttributes')) {
        }
    };
    PokemonQuery.prototype.parseSortOrder = function () {
        if (this.reqBody.hasOwnProperty('sortOrder')) {
        }
    };
    return PokemonQuery;
}());
exports.default = PokemonQuery;
//# sourceMappingURL=PokemonQuery.js.map