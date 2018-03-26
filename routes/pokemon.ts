//pokemon.js
import Main from '../app';
import * as express from "express"

export class PokemonRoute {
    public static get(req, res: express.Response) { //, next: express.NextFunction){
        Main.connection.query('SELECT * FROM pokemon', (err, rows, fields) => {
            if (err) {
                req.flash('error', err)
                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    data: ''
                });
            } else {
                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    data: rows
                });
            }
        });
    }
}
