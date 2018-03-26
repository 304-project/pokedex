//pokemon.js
import Main from '../app';
import * as express from "express"
export class PokemonRoute{
    public static get(req, res: express.Response){ //, next: express.NextFunction){
        // console.log(req);
        // req.getConnection();

            Main.connection.query('SELECT * FROM pokemon',function(err, rows, fields) {
                //if(err) throw err
                if (err) {
                    // req.flash('error', err)
                    // res.render('pokemon/list', {
                    //     title: 'Pokemon List',
                    //     data: ''
                    // })
                    console.log(err.message);
                } else {
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
        }
}
