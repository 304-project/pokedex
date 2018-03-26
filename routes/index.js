"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IndexRoute = /** @class */ (function () {
    function IndexRoute() {
    }
    IndexRoute.getIndex = function (req, res) {
        // render to views/index.ejs template file
        res.render('index', { title: 'Pokedex' });
    };
    return IndexRoute;
}());
exports.IndexRoute = IndexRoute;
