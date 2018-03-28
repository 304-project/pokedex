//pokemon.js
import Main from '../app';
import * as express from "express"
const origQuery = 'select p.pokedexId, p.name, p.height, p.weight, h.identifier, t.typeName from pokemon p join pokemontypes pt on p.pokedexId = pt.pokedexId join habitats h on p.habitatId = h.habitatId join typeslist t on pt.typeId = t.typeId';
var query = origQuery;
var sort = ' order by p.pokedexId asc';

export class PokemonRoute {

    public static get(req: any, res: express.Response) { //, next: express.NextFunction){
        req.assert('name', 'Name is required').notEmpty();           //Validate name
        var errors = req.validationErrors();

        if (!errors) {
            var searchPokemon = {
                name: req.sanitize('name').escape().trim(),
            };
            var searchId = {
                name: req.sanitize('name').escape().trim(),
            };
            var searchId = {
                name: req.sanitize('name').escape().trim(),
            };
            var searchId = {
                name: req.sanitize('name').escape().trim(),
            };
            query += " where " +  + searchPokemon + "'";
        }
        else{
            query = origQuery;
        }
        Main.connection.query(query, (err: any, rows: any, fields: any) => {
            if (err) {
                req.flash('error', err);
                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    data: '',
                    id: '',
                    name: '',
                    type: '',
                    habitat: '',
                    query: '',
                    loggedInUser: Main.loggedInUser.getJson()
                });
            } else {
                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    data: rows,
                    id: '',
                    name: '',
                    type: '',
                    habitat: '',
                    query: '',
                    loggedInUser: Main.loggedInUser.getJson()
                });
            }
        });
    }

}
