import Main from '../app';
import * as express from "express"

export class IndexRoute{
    public static getIndex(req, res: express.Response) { //, next: express.NextFunction){
        // render to views/index.ejs template file
        res.render('index', {title: 'Pokedex'});
    }
}