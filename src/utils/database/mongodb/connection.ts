
import mongodb from 'mongodb'
import { Wrapper } from "../../helpers/wrapper";
require('dotenv').config();
export default interface IMongoConnection{
    connect():any
}

export class MongoConnection implements IMongoConnection{
    wrapper: Wrapper;
    constructor(){
        this.wrapper = new Wrapper()
    }
    async connect() {
        const conn = await mongodb.connect(process.env.mongoURL||'mongodb://localhost:27017/learn')
        return this.wrapper.data(conn)
    }
    async checkConnection(){
        const conn = await this.connect()
        if (conn.err) {
            console.log(conn.err);
        }
        return conn.data
    }
}