import Main from '../app';

export default class User{
    public isLoggedIn: boolean = false;
    private username: string;
    private password: string;
    private age: number;
    private email: string;
    private privilegeLevel: number = 0; //0 = regular user, 1 = admin privileges

    constructor(){

    }

    public logout(): any {
        this.isLoggedIn = false;
        this.username = null;
        this.password = null;
        this.age = null;
        this.email = null;
        this.privilegeLevel = 0;
    }

    public getJson(): any{
        //Separate function because we might change the way we parse it
        let toRtn: any = JSON.stringify(this);
        return JSON.stringify(this);
    }

    public logIn(username: string, password: string): Promise<boolean>{
        let sql: string = "SELECT * FROM users " +
                          "WHERE name = \"" + username + "\" AND password = \"" + password + "\"";
        let that = this;

        return new Promise(function (resolve, reject) {
            Main.connection.query(sql, (err: any, rows: any, fields: any) => {
                if (err) {
                    console.log("ERROR: " + err.message.toString());
                } else {
                    if(rows.length > 0){
                        console.log("Login successful");
                        that.username = username;
                        that.password = password;
                        that.privilegeLevel = rows[0].privilegeLevel;
                        that.email = rows[0].email;
                        that.age = rows[0].age;

                        that.isLoggedIn = true;
                    }else{
                        console.log("Incorrect username or password");
                    }
                }
                return resolve(that.isLoggedIn);
            });
        });
        // return that.isLoggedIn;
    }
}