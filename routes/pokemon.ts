//pokemon.js
import Main from '../app';
import * as express from "express"

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
            groupBy: '',
            groupValue: '',
            sortDirection: '',
            sortValue: '',
            loggedInUser: Main.loggedInUser.getJson()

        });
    }

    public static evaluatePokemon(req: any, res: express.Response) {


        let usedQuery = null ;
        let tempval = req.body.groupValue;


        if (tempval === 'Type'){ tempval = 'typeName';}
        else if (tempval === 'Habitat'){ tempval = 'identifier';}
        else{}

        let tempval2 = req.body.groupBy;

        if (tempval2 === 'Type'){ tempval2 = 'typeName';}
        else if (tempval2 === 'Habitat'){ tempval2 = 'identifier';}
        else{}

        if (req.body.groupValue === req.body.groupBy){
            tempval2 = "pokedexID"
        }

        const groupQuery = 'select ' + req.body.groupEval + '(gsub.' + tempval2 +') as ' + req.body.groupEval + ',gsub.'+ tempval + ' from (' + query + ') gsub group by gsub.' + tempval ;

        if ((req.body.groupEval === "") ||!(req.body.groupValue)){
            usedQuery = query ;
        }else{
            usedQuery = groupQuery;
        }

        let tempval3 = req.body.groupEval + '(sub.' + tempval2 + ')';

        let tempsortValue = req.body.sortValue;

        if ((tempsortValue != 'typeName')&&(tempsortValue != 'Habitat')){
            tempsortValue = req.body.groupEval ;
            tempval3 = tempsortValue ;
        }

        console.log("im here");
        console.log("im here");
        console.log("tempsortvalue");
        console.log(tempsortValue);



        const sortQuery = 'select sub.* from (' + usedQuery + ') sub order by sub.' +tempsortValue + ' ' +  req.body.sortDirection;

        if (req.body.sortDirection === "" || !(req.body.sortValue)){
            //usedQuery = query ;
        }else{
            usedQuery = sortQuery;
        }


        console.log("im here");
        console.log("im here");
        console.log("im here");
        console.log(usedQuery);


        Main.connection.query(usedQuery, ( err: any, rows: any, fields: any ) => {
            if (err) {
                req.flash('error', err);
                res.render('pokemon/list', {
                    title: 'Pokemon List',
                    data: '',
                    loggedInUser: Main.loggedInUser.getJson()
                });
            } else if (!(req.body.groupEval === "") &&(req.body.groupValue)){

                res.render('pokemon/group', {
                    title: 'Pokemon List',
                    groupValue:req.body.groupValue ,
                    groupHeader:tempval,
                    groupEval:req.body.groupEval + '(' + req.body.groupBy+ ')',
                    subGroupEval:tempval3,
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
