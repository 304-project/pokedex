import Main from '../app';

export default class User{
    private username: string;
    private password: string;
    private loggedIn: boolean = false;

    constructor(username: string, password: string){
        this.username = username;
        this.password = password;
    }

    public register(){
        let sql: string = "INSERT INTO users (" + this.username + ", " + this.password; //TODO: create users database table
        Main.connection.query(sql);
    }

    public logIn(){
        let sql: string = "SELECT * FROM users " +
                          "WHERE username = " + this.username + "AND password = " + this.password;
        let that = this;

        Main.connection.query(sql, (err, rows, fields) => {
            if (err) {
                console.log("ERROR: " + err.message.toString());
            } else {
                if(rows.length > 0){
                    that.loggedIn = true;
                    console.log("Login successful");
                }else{
                    console.log("Incorrect username or password");
                }
            }
        });

    }
}