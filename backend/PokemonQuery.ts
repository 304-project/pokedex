import Main from '../app';
import {isNull, isUndefined} from "util";

export default class PokemonQuery {
    columns: string[] = null;
    from: string[] = null;
    where: string[] = null; //filter

    group: string[] = null;
    sortAttributes: string[] = null;
    sortOrder: string = null;

    reqBody: any;

    constructor(){

    }

    public setAndParseReqBody(reqBody: any): void{
        this.reqBody = reqBody;
        this.parseAll();
    }

    public setNestedInnerQuery(nestedQuery: PokemonQuery): void{
        this.from = ["(" + nestedQuery.buildSqlQuery() + ")"];
    }

    public buildSqlQuery(): string{
        let sql: string = "";
        if(!isNull(this.columns)){
            sql += 'SELECT ' + this.columns;
        }if(!isNull(this.from)){
            sql += ' FROM ' + this.from;
        }
        if(!isNull(this.where)){
            sql += ' WHERE ' + this.where;
        }
        if(!isNull(this.group)){
            sql += ' GROUP BY ' + this.group;
        }
        if(!isNull(this.sortAttributes)){
            sql += ' ORDER BY ' + this.sortAttributes;
        }
        if(!isNull(this.sortOrder)){
            sql += ' ' + this.sortOrder;
        }

        return sql;
    }
    public buildfilterQuery(query:any , filterval : any): string{
        let sql: string = "";

        let thiscolumn :string = "" ;

        for (var key in filterval) {
            if (filterval.hasOwnProperty(key)) {
                if ((key.indexOf("Column") > 0 ) && (filterval[key] != undefined)) {
                    let item = key.substr(0, key.indexOf("Column"));
                    thiscolumn += 'fsub.' + item + ', ';
                }
            }
        }
        let temp = "";

        if (thiscolumn != ""){
            sql += 'SELECT ' + thiscolumn.substr(0, thiscolumn.length-2) ;
        }else {
            sql += 'SELECT fsub.*'
        }


        sql +=  ' FROM (' + query + ') fsub' ;

        let thiswhere :string = "" ;
        let cond : string = "" ;
        let item : string = "";

        for (var key in filterval){
            if (filterval.hasOwnProperty(key)) {
                if ((key.indexOf("Val") > 0 ) && (filterval[key] != "")) {
                    item = key.substr(0,key.indexOf("Val"));

                    if ((filterval[item+'DropAndOr']!= "") && (filterval[item+'DropAndOr']!= undefined)){
                        cond = filterval[item+"DropAndOr"] ;
                        thiswhere += 'fsub.'+item + ' = ' + "'"+ filterval[key]+ "'" + ' ' +  cond + ' ';
                    }else {
                        thiswhere += 'fsub.'+item + ' = ' + "'" + filterval[key]+ "'" ;
                    }
                }
            }
        }

        if (thiswhere == ""){

        }else {
            sql +=  ' WHERE ' + thiswhere ;
        }

        if ((thiscolumn == "") && (thiswhere == "")) {
            return query
        }else {
            return sql;
        }

    }
    private parseAll(): void{
        this.parseColumns();
        this.parseFrom();
        this.parseWhere();
        this.parseGroup();
        this.parseSortOrder();
        this.parseSortAttributes();
    }

    private parseColumns(): void{
        if(this.reqBody.hasOwnProperty('columns')){
            this.columns = this.reqBody.columns;
        }
    }private parseFrom(): void{
        if(this.reqBody.hasOwnProperty('from')){
            this.from = this.reqBody.from;
        }
    }
    private parseGroup(): void{
        if(this.reqBody.hasOwnProperty('group')){
            this.group = this.reqBody.group;
        }
    }
    private parseWhere(): void{
        if(this.reqBody.hasOwnProperty('where')){
            this.where = this.reqBody.where;
        }
    }
    private parseSortAttributes(): void{
        if(this.reqBody.hasOwnProperty('sortAttributes')){
            this.sortAttributes = this.reqBody.sortAttributes;
        }
    }
    private parseSortOrder(): void{
        if(this.reqBody.hasOwnProperty('sortOrder')){
            this.sortOrder = this.reqBody.sortOrder;
        }
    }

    private runQuery(): Promise<any>{
        let that = this;
        return new Promise(function (resolve, reject) {

            let sqlQuery = that.buildSqlQuery();
            Main.connection.query(sqlQuery,  (err: any, rows: any, fields: any) => {
                return resolve(rows);
            });

        });
    }
}