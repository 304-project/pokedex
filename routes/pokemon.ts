//pokemon.js
import Main from '../app';
import * as express from "express"
import {isNull, isNullOrUndefined} from "util";
import PokemonQuery from '../backend/PokemonQuery';

//const query = 'select p.pokedexId, p.name, p.height, p.weight, h.identifier, t.typeName from pokemon p join pokemontypes pt on p.pokedexId = pt.pokedexId join habitats h on p.habitatId = h.habitatId join typeslist t on pt.typeId = t.typeId';
const origJoin = 'pokemon p join typeslist t on p.typeId = t.typeId join habitats h on p.habitatId = h.habitatId join evolvesinto e on p.pokedexId = e.evolvesFromId join pokemon p2 on p2.pokedexId = e.pokedexId';
const origColumns = 'p.pokedexId, p.name, p.height, p.weight, identifier, typeName, p2.name as evolvesInto';
const origSort = 'p.pokedexId';
const origSortOrder = 'asc';
const columnMap = {
    nameColumn: 'p.name',
    idColumn: 'p.pokedexId',
    typeColumn: 'typeName',
    heightColumn: 'p.height',
    weightColumn: 'p.weight',
    habitatColumn: 'identifier',
    evolvesIntoColumn: 'p2.name'
};
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
            idColumn: false,
            nameColumn: false,
            heightColumn: false,
            weightColumn: false,
            typeColumn: false,
            habitatColumn: false,
            evolvesIntoColumn: false,
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
        var reqBody = {columns: '', from: ''};
        // this.getColumns(req, reqBody);
        // this.getFrom(req, reqBody);
        // this.getWhere(req, reqBody);

        if (tempval === 'Type'){ tempval = 'typeName';}
        else if (tempval === 'Habitat'){ tempval = 'identifier';}
        else{}

        let tempval2 = req.body.groupBy;
        let tempval4 = tempval2;

        if (tempval2 === 'Type'){ tempval2 = 'typeName';}
        else if (tempval2 === 'Habitat'){ tempval2 = 'identifier';}
        else{}

        if (req.body.groupValue === req.body.groupBy){
            tempval2 = 'pokedexId' ;
            tempval4 = tempval2;
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


        const sortQuery = 'select sub.* from (' + usedQuery + ') sub order by sub.' +tempsortValue + ' ' +  req.body.sortDirection;

        if (req.body.sortDirection === "" || !(req.body.sortValue)){
            //usedQuery = query ;
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

    public getColumns(req:any, reqBody: any){
        for(var i in req.body) {
            if(i.indexOf("Column") > 0){
                reqBody.columns += columnMap[i] + ", ";
            }
        }
        if(reqBody.columns.length == 0){
            reqBody.columns = origColumns;
        }
        else{
            reqBody.columns = reqBody.columns.substring(0, reqBody.columns.length-2);
        }
    }

    public getFrom(req:any, reqBody: any){

    }
    public getWhere(req:any, reqBody: any){

    }


}
