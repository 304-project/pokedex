"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = (function () {
    function config() {
    }
    config.database = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: 3306,
        db: 'pokedex'
    };
    config.server = {
        host: '127.0.0.1',
        port: '3000'
    };
    return config;
}());
exports.default = config;
//# sourceMappingURL=config.js.map