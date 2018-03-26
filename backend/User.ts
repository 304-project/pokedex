import Main from '../app';

export default class User{
    private username: string;
    private password: string;
    public isLoggedIn: boolean = false;

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
                          "WHERE username = \"" + this.username + "\" AND password = \"" + this.password + "\"";
        let that = this;

        Main.connection.query(sql, (err: any, rows: any, fields: any) => {
            if (err) {
                console.log("ERROR: " + err.message.toString());
            } else {
                if(rows.length > 0){
                    that.isLoggedIn = true;
                    console.log("Login successful");
                }else{
                    console.log("Incorrect username or password");
                }
            }


        });
        return that.isLoggedIn;
    }
}