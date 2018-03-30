//pokemon.js
import Main from '../app';
import * as express from "express"
import {isNull, isNullOrUndefined} from "util";
import PokemonQuery from '../backend/PokemonQuery';

//const query = 'select p.pokedexId, p.name, p.height, p.weight, h.identifier, t.typeName from pokemon p join pokemontypes pt on p.pokedexId = pt.pokedexId join habitats h on p.habitatId = h.habitatId join typeslist t on pt.typeId = t.typeId';
const origJoin = 'pokemon p join typeslist t on p.typeId = t.typeId join habitats h on p.habitatId = h.habitatId join evolvesinto e on p.pokedexId = e.evolvesFromId join pokemon p2 on p2.pokedexId = e.pokedexId';
const origColumns = 'p.pokedexId, p.name, p.height, p.weight, h.identifier, t.typeName, p2.name as evolvesInto';
const origSort = 'p.pokedexId';
const origSortOrder = 'asc';
var origBody = {'columns': origColumns, 'from': origJoin, 'sortAttributes': origSort, 'sortOrder': origSortOrder};
var pq = new PokemonQuery();
pq.setAndParseReqBody(origBody);
var query = pq.buildSqlQuery();

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


    public static showEvaluatePokemonForm(req: any, res: express.Response) {

        res.render('pokemon/evaluate', {
            title: 'Pokemon',
            filterNameDropMaxMin: '',
            filterNameDropAndOr: '',
            filterNameVal: '',
            filterNameCheck: '',
            filterTypeDropMaxMin: '',
            filterTypeDropAndOr: '',
            filterTypeVal: '',
            filterTypeCheck: '',
            filterIdDropMaxMin: '',
            filterIdDropAndOr: '',
            filterIdVal: '',
            filterIdCheck: '',
            filterHabitatDropMaxMin: '',
            filterHabitatDropAndOr: '',
            filterHabitatVal: '',
            filterHabitatCheck: '',
            filterHeightDropMaxMin: '',
            filterHeightDropAndOr: '',
            filterHeightVal: '',
            filterHeightCheck: '',
            filterWeightDropMaxMin: '',
            filterWeightDropAndOr: '',
            filterWeightVal: '',
            filterWeightCheck: '',
            idColumn: '',
            nameColumn: '',
            heightColumn: '',
            weightColumn: '',
            typeColumn: '',
            habitatColumn: '',
            evolvesIntoColumn: '',
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
        let tempval2 = req.body.groupBy;
        let tempval3 = req.body.groupEval + '(sub.' + tempval2 + ')';
        let tempsortValue = req.body.sortValue;
        let tempval4 = tempval2;

        let filterVal :any = {
            nameDropMaxMin: req.body.filterNameDropMaxMin,
            nameDropAndOr: req.body.filterNameDropAndOr,
            nameVal:  req.body.filterNameVal,
            nameCheck: req.body.filterNameCheck,
            typeDropMaxMin: req.body.filterTypeDropMaxMin,
            typeDropAndOr: req.body.filterTypeDropAndOr,
            typeNameVal: req.body.filterTypeVal,
            typeCheck: req.body.filterTypeCheck,
            IdDropMaxMin: req.body.filterIdDropMaxMin,
            IdDropAndOr: req.body.filterIdDropAndOr,
            IdVal: req.body.filterIdVal,
            IdCheck: req.body.filterIdCheck,
            HabitatDropMaxMin: req.body.filterHabitatDropMaxMin,
            HabitatDropAndOr: req.body.filterHabitatDropAndOr,
            HabitatVal:  req.body.filterHabitatVal,
            HabitatCheck: req.body.filterHabitatCheck,
            HeightDropMaxMin: req.body.filterHeightDropMaxMin,
            HeightDropAndOr: req.body.filterHeightDropAndOr,
            HeightVal: req.body.filterHeightVal,
            HeightCheck: req.body.filterHeightCheck,
            WeightDropMaxMin: req.body.filterWeightDropMaxMin,
            WeightDropAndOr: req.body.filterWeightDropAndOr,
            WeightVal: req.body.filterWeightVal,
            WeightCheck: req.body.filterWeightCheck,
            pokedexIdColumn: req.body.idColumn,
            nameColumn: req.body.nameColumn,
            heightColumn: req.body.heightColumn,
            weightColumn: req.body.weightColumn,
            typeColumn: req.body.typeColumn,
            habitatColumn: req.body.habitatColumn,
            evolvesIntoColumn: req.body.evolvesIntoColumn
        } ;

        const filterQuery = pq.buildfilterQuery(query, filterVal);

        //const filterQuery = 'select fsub.* from (' + query + ') fsub where' ;

        console.log("im here");
        console.log("im here");
        console.log("im here");
        console.log("im here... finally");
        console.log(filterQuery);





        if (tempval === 'Type'){ tempval = 'typeName';}
        else if (tempval === 'Habitat'){ tempval = 'identifier';}

        if (tempval2 === 'Type'){ tempval2 = 'typeName';}
        else if (tempval2 === 'Habitat'){ tempval2 = 'identifier';}


        if (req.body.groupValue === req.body.groupBy){
            tempval2 = 'pokedexId' ;
            tempval4 = tempval2;
        }

        const groupQuery = 'select ' + req.body.groupEval + '(gsub.' + tempval2 +') as ' + req.body.groupEval + ',gsub.'+ tempval + ' from (' + filterQuery + ') gsub group by gsub.' + tempval ;

        if ((req.body.groupEval === "") ||!(req.body.groupValue)){
            usedQuery = filterQuery ;
        }else{
            usedQuery = groupQuery;
        }



        if ((tempsortValue != 'typeName')&&(tempsortValue != 'Habitat')){
            tempsortValue = req.body.groupEval ;
            tempval3 = tempsortValue ;
        }
        const sortQuery = 'select sub.* from (' + usedQuery + ') sub order by sub.' +tempsortValue + ' ' +  req.body.sortDirection;

        if (req.body.sortDirection === "" || !(req.body.sortValue)){

        }else{
            usedQuery = sortQuery;
        }


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
                    groupEval:req.body.groupEval + '(' + tempval2 + ')',
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
