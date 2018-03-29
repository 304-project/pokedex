//pokemon.js
import Main from '../app';
import * as express from "express"

//const query = 'select p.pokedexId, p.name, p.height, p.weight, h.identifier, t.typeName from pokemon p join pokemontypes pt on p.pokedexId = pt.pokedexId join habitats h on p.habitatId = h.habitatId join typeslist t on pt.typeId = t.typeId';
const query = 'select p.pokedexId, p.name, p.height, p.weight, h.identifier, t.typeName from pokemon p join typeslist t on p.typeId = t.typeId join habitats h on p.habitatId = h.habitatId ORDER BY p.pokedexId ASC';
export class PokemonRoute {

    public static get(req: any, res: express.Response) { //, next: express.NextFunction){
        Main.connection.query(query, (err: any, rows: any, fields: any) => {
            if (err) {
                req.flash('error', err);
                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    data: '',
                    loggedInUser: Main.loggedInUser.getJson()
                });
            } else {
                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    data: rows,
                    loggedInUser: Main.loggedInUser.getJson()
                });
            }
        });
    }

    public static search(req: any, res: express.Response){
        
    }

    public static showEvaluatePokemonForm(req: any, res: express.Response) {

        res.render('pokemon/evaluate', {
            title: 'Pokemon',
            filterName: '',
            filterType: '',
            filterHabitat: '',
            groupType: '',
            groupHabitat: '',
            groupRegion: '',
            sortId: '',
            sortHeight:'',
            sortWeight:'',
            loggedInUser: Main.loggedInUser.getJson()

        });
    }

    public static evaluatePokemon(req: any, res: express.Response) {


        Main.connection.query(query, (err: any, rows: any, fields: any) => {
            if (err) {
                req.flash('error', err);

            } else {
                Main.connection.query(query, ( err: any, rows: any, fields: any ) => {
                    if (err) {
                        req.flash('error', err);
                        res.render('pokemon/list', {
                            title: 'Pokemon List',
                            data: '',
                            loggedInUser: Main.loggedInUser.getJson()
                        });
                    } else {

                        res.render('pokemon/list', {
                            title: 'Pokemon List',
                            data: rows,
                            loggedInUser: Main.loggedInUser.getJson()
                        });

                    }
                });
            }

        });


    }


}
