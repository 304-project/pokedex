"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IndexRoute = (function () {
    function IndexRoute() {
    }
    IndexRoute.getIndex = function (req, res) {
        res.render('index', { title: 'Pokedex' });
    };
    return IndexRoute;
}());
exports.IndexRoute = IndexRoute;
//# sourceMappingURL=index.js.map