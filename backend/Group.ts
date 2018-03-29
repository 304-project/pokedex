import Main from '../app';

export default class Group{

    public header1: string = '';
    public header2: string = '';

    constructor(){
    }

    public setHeaders(groupEval: string , groupValue :string) : any {

        let that = this;
        that.header1 = groupValue ;
        that.header2 = groupEval + 'pokedexId';

    }
}