"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = /** @class */ (function () {
    function config() {
    }
    config.database = {
        host: 'localhost',
        user: 'pokedex',
        password: 'pikachu',
        port: 3306,
        db: 'pokemon' // your database name
    };
    config.server = {
        host: '127.0.0.1',
        port: '3000'
    };
    return config;
}());
exports.default = config;
