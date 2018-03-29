//pokemon.js
import Main from '../app';
import * as express from "express"
import Group from "../backend/Group";

//const query = 'select p.pokedexId, p.name, p.height, p.weight, h.identifier, t.typeName from pokemon p join pokemontypes pt on p.pokedexId = pt.pokedexId join habitats h on p.habitatId = h.habitatId join typeslist t on pt.typeId = t.typeId';
const query = 'select p.pokedexId, p.name, p.height, p.weight, h.identifier, t.typeName from pokemon p join typeslist t on p.typeId = t.typeId join habitats h on p.habitatId = h.habitatId order by p.pokedexId asc';
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
            filterId: '',
            filterHabitat: '',
            filterHeight: '',
            filterHeight1: '',
            filterHeight2: '',
            filterWeight: '',
            filterWeight1: '',
            filterWeight2: '',
            groupEval: '',
            groupValue: '',
            sortDirection: '',
            sortValue: '',
            loggedInUser: Main.loggedInUser.getJson()

        });
    }

    public static evaluatePokemon(req: any, res: express.Response) {


        let usedQuery = null ;

        const groupQuery = 'select ' + req.body.groupEval + '(sub.pokedexId),sub.'+ req.body.groupValue + ' from (' + query + ') sub group by sub.' + req.body.groupValue ;

        if ((req.body.groupEval === "") ||!(req.body.groupValue)){
            usedQuery = query ;
        }else{
            usedQuery = groupQuery;
        }

        console.log("im here");
        console.log("im here");
        console.log("im here");
        console.log(usedQuery);



        /*const sortQuery = 'select sub.* from (' + usedQuery + ') sub order by sub.' +req.body.sortValue + ' ' +  req.body.sortDirection;

        if (req.body.sortDirection === "" || !(req.body.sortValue)){
            //usedQuery = query ;
        }else{
            usedQuery = sortQuery;
        }*/



        Main.connection.query(usedQuery, ( err: any, rows: any, fields: any ) => {
            if (err) {
                req.flash('error', err);
                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    data: '',
                    loggedInUser: Main.loggedInUser.getJson()
                });
            } else if (!(req.body.groupEval === "") &&(req.body.groupValue)){

                Main.currentGroup.setHeaders(req.body.groupEval , req.body.groupValue) ;

                res.render('pokemon/group', {
                    title: 'Pokemon List',
                    data: rows,
                    loggedInUser: Main.loggedInUser.getJson()
                });

            }else {

                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    data: rows,
                    loggedInUser: Main.loggedInUser.getJson()
                });

            }
        });



    }


}
