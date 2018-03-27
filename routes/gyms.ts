import Main from '../app';
import * as express from "express"

const query = 'select g.leader, r.identifier, g.locationName, t.typeName, g.badge from gym g join regions r on g.regionId = r.regionId join typeslist t on t.typeId = g.typeId';

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
              console.log(rows);
                res.render('gyms/list', {
                    title: 'Gyms List',
                    data: rows,
                    loggedInUser: Main.loggedInUser.getJson()
                });
            }
        });
    }

    public static search(req: any, res: express.Response){

    }

}
