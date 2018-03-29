import Main from '../app';
import {isNull} from "util";

export default class PokemonQuery {
    public group: string[] = null;
    public where: string[] = null; //filter
    public sortAttributes: string[] = null;
    public sortOrder: string = null;

    reqBody: any;
    constructor(reqBody: any){
        this.reqBody = reqBody;
        this.parseWhere();
        this.parseGroup();
        this.parseSortOrder();
        this.parseSortAttributes();
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

    private buildSqlQuery(): string{
        let sql: string = 'SELECT * FROM pokemon';

        if(!isNull(this.where)){
            sql += ' WHERE ' + this.where.join(" AND ");
        }
        if(!isNull(this.group)){
            sql += ' GROUP BY ' + this.group.join(', ');
        }
        if(!isNull(this.sortAttributes)){
            sql += 'ORDER BY ' + this.sortAttributes.join(', ');
        }
        if(!isNull(this.sortOrder)){
            sql += ' ' + this.sortOrder;
        }

        return sql;
    }

    private parseGroup(): void{
        if(this.reqBody.hasOwnProperty('group')){

        }
    }
    private parseWhere(): void{
        if(this.reqBody.hasOwnProperty('where')){

        }
    }
    private parseSortAttributes(): void{
        if(this.reqBody.hasOwnProperty('sortAttributes')){

        }
    }
    private parseSortOrder(): void{
        if(this.reqBody.hasOwnProperty('sortOrder')){

        }
    }
}