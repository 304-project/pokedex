"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//pokemon.js
var app_1 = require("../app");
var PokemonRoute = /** @class */ (function () {
    function PokemonRoute() {
    }
    PokemonRoute.get = function (req, res) {
        // console.log(req);
        // req.getConnection();
        app_1.default.connection.query('SELECT * FROM pokemon', function (err, rows, fields) {
            //if(err) throw err
            if (err) {
                // req.flash('error', err)
                // res.render('pokemon/list', {
                //     title: 'Pokemon List',
                //     data: ''
                // })
                console.log(err.message);
            }
            else {
                // render to views/pokemon/list.ejs template file
                console.log(rows);
                return rows;
                // res.render('pokemon/list', {
                //     title: 'Pokemon List',
                //     data: rows
                // })
                // console.log("success");
            }
        });
    };
    return PokemonRoute;
}());
exports.PokemonRoute = PokemonRoute;
