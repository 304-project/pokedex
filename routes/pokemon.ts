//pokemon.js
import Main from '../app';
import * as express from "express"

export class PokemonRoute {

    public static get(req: any, res: express.Response) { //, next: express.NextFunction){
        Main.connection.query('SELECT * FROM pokemon', (err: any, rows: any, fields: any) => {
            if (err) {
                req.flash('error', err);
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

    public static search(req: any, res: express.Response){
        
    }

}
