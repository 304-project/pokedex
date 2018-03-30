import Main from '../app';
import * as express from "express"

const query = 'select g.leader, r.identifier, g.locationName, t.typeName, g.badge from gym g join regions r on g.regionId = r.regionId join typeslist t on t.typeId = g.typeId';
var typeSelect = 'grass';
const queryJoin = 'select p.name, t.typeName, g.badge from pokemon p join typeslist t on t.typeId = p.typeId join gym g on t.typeId = g.typeId where t.typeName = ';
export class GymsRoute {
    public static get(req: any, res: express.Response) { //, next: express.NextFunction){
        Main.connection.query(query, (err: any, rows: any, fields: any) => {
            if (err) {
                req.flash('error', err);
                res.render('gyms/list', {
                    title: 'Gyms List',
                    data: '',
                    loggedInUser: Main.loggedInUser.getJson()
                });
            } else {
              // console.log(rows
                res.render('gyms/list', {
                    title: 'Gyms List',
                    data: rows,
                    loggedInUser: Main.loggedInUser.getJson()
                });
            }
        });
    }

    public static eval(req: any, res: express.Response){
        res.render('gyms/eval', {
            title: 'Eval List'
        });
    }

    public static join(req: any, res: express.Response){
        var find = req.body.find;
        var qJoin = queryJoin + "'" + find + "'";
        Main.connection.query(qJoin, (err: any, rows: any, fields: any) => {
            if (err) {
                req.flash('error', err);
                res.render('gyms/join', {
                    title: 'Join List',
                    data: '',
                    find: '',
                    loggedInUser: Main.loggedInUser.getJson()
                });
            } else {
                // console.log(rows
                res.render('gyms/join', {
                    title: 'Join List',
                    data: rows,
                    loggedInUser: Main.loggedInUser.getJson()
                });
            }
        });
    }

}
