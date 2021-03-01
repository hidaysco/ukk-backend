import mysql from 'mysql';
require('dotenv').config()

export class MySQL {
    constructor() {
    }
    createConnection(){
        const db = mysql.createPool({
            connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT) || 10,
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        })
        return db
    }

    getConnetion(){
        const pool = this.createConnection()
        pool.getConnection((err, connection)=>{
            if (err) {
                console.log(err);
            }
            console.log('Connected to Database');
        })
    }
}