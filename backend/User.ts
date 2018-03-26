import Main from '../app';

export default class User{
    public isLoggedIn: boolean = false;

    private username: string;
    private password: string;
    private age: number;
    private email: string;
    private privilegeLevel: number = 0; //0 = regular user, 1 = admin privileges

    constructor(username: string, password: string){
        this.username = username;
        this.password = password;
    }

    public register(){
        let sql: string = "INSERT INTO users VALUES(\"" + this.username + "\", \"" + this.password + "\")"; //TODO: create users database table
        Main.connection.query(sql);
    }

    public logIn(): boolean{
        let sql: string = "SELECT * FROM users " +
                          "WHERE name = \"" + this.username + "\" AND password = \"" + this.password + "\"";
        let that = this;

        return Main.connection.query(sql, (err: any, rows: any, fields: any) => {
            if (err) {
                console.log("ERROR: " + err.message.toString());
            } else {
                if(rows.length > 0){
                    console.log("Login successful");
                    that.isLoggedIn = true;
                }else{
                    console.log("Incorrect username or password");
                }
            }
            return that.isLoggedIn;
        });
        // return that.isLoggedIn;
    }
}