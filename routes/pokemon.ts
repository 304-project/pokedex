//pokemon.js
import Main from '../app';
import * as express from "express"
import {isNull, isNullOrUndefined} from "util";

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
    public static managePokemonTypes(req: any, res: express.Response) { //, next: express.NextFunction){
        let query: string = "SELECT * FROM typeslist ORDER BY typeId ASC";
        Main.connection.query(query, (err: any, rows: any, fields: any) => {
            if (err) {
                req.flash('error', err);
                res.render('pokemon/types/list', {
                    title: 'Pokemon Types List',
                    data: '',
                    loggedInUser: Main.loggedInUser.getJson()
                });
            } else {
                res.render('pokemon/types/list', {
                    title: 'Pokemon Types List',
                    data: rows,
                    loggedInUser: Main.loggedInUser.getJson()
                });
            }
        });
    }
    public static deletePokemonType(req: any, res: express.Response) {
        let sql: string = 'DELETE FROM typeslist WHERE typeId = ' + req.params.typeId;
        Main.connection.query(sql, function (err: any, result: any) {
            //if(err) throw err
            if (err) {
                req.flash('error', err.message);
                // redirect to users list page
                res.redirect('/pokemon/types')
            } else {
                req.flash('success', 'Pokemon type and associated Pokemon deleted!');
                // redirect to users list page
                res.redirect('/pokemon/types')
            }
        });
    }
    public static updatePokemonTypeName(req: any, res: express.Response) {
        //TODO: CHECK CONSTRAINT
        let sql1: string = 'SELECT * FROM typeslist WHERE typeName = "' + req.body.typeName + '"';

        Main.connection.query(sql1, function (err: any, result: any) {
            //if(err) throw err
            if (err) {
                req.flash('error', err);
                // redirect to users list page
                res.redirect('/pokemon/types')
            } else {
                if(result.length == 0){
                    let sql: string = 'UPDATE typeslist SET typeName = "' + req.body.typeName + '" WHERE typeId = ' + req.params.typeId;

                    Main.connection.query(sql, function (err: any, result: any) {
                        //if(err) throw err
                        if (err) {
                            req.flash('error', err);
                            // redirect to users list page
                            res.redirect('/pokemon/types')
                        } else {
                            req.flash('success', 'Type updated successfully!');
                            // redirect to users list page
                            res.redirect('/pokemon/types')
                        }
                    });
                }else{
                    req.flash('error', 'CONSTRAINT VIOLATED: Unable to change Pokemon type name to an existing name');
                    res.redirect('/pokemon/types')
                }

            }
        });


    }

    public static showFormUpdatePokemonTypeName(req: any, res: express.Response) {
        res.render('pokemon/types/edit', {
            title: 'Edit Pokemon Type',
            typeId: req.params.typeId,
            typeName: req.params.typeName,
            loggedInUser: Main.loggedInUser.getJson()
        });
    }

    public static search(req: any, res: express.Response){
        
    }

    public static showEvaluatePokemonForm(req: any, res: express.Response) {

        console .log ("at least we get here");
        console .log ("at least we get here");
        console .log ("at least we get here");
        console .log ("at least we get here");
        console .log ("at least we get here");
        console .log ("at least we get here");


        res.render('pokemon/evaluate', {
            title: 'Pokemon Evaluate',
            filterName: '',
            filterType: '',
            filterHabitat: '',
            groupType: '',
            groupHabitat: '',
            groupRegion: '',
            sortId: '',
            sortHeight:'',
            sortWeight:''

        });
    }

    public static filterPokemon(req: any, res: express.Response) {

        let temp:any = null ;
        let filterQuery = 'SELECT * FROM pokemon WHERE ';


        Main.connection.query(query, (err: any, rows: any, fields: any) => {
            if (err) {
                req.flash('error', err);

            } else {
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
        });


    }

    public static sortPokemon(req: any, res: express.Response) {

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

    public static groupPokemon(req: any, res: express.Response) {

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

}
