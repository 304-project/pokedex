"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var IndexRoute = (function () {
    function IndexRoute() {
    }
    IndexRoute.getIndex = function (req, res) {
        res.render('index', {
            title: 'Pokedex',
            loggedInUser: app_1.default.loggedInUser.getJson()
        });
    };
    return IndexRoute;
}());
exports.IndexRoute = IndexRoute;
//# sourceMappingURL=index.js.map