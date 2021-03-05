import express from 'express';
import { IHandler } from './shared/IHandler';
import UserHandler from './handler/userHandler';
import { MongoConnection } from './utils/database/mongodb/connection';
import bodyParser from "body-parser";
import cors from "cors";
require('dotenv').config();

class App {
    defaultApps: express.Application
    db: MongoConnection
    constructor(handler:IHandler[]) {
        this.defaultApps = express()
        this.initPlugin()
        this.initHandler(handler)
        this.db = new MongoConnection()
        this.initConnection()
    }
    protected initPlugin(){
        this.defaultApps.use(bodyParser.json())
        this.defaultApps.use(bodyParser.urlencoded({extended:true}))
        this.defaultApps.use(cors())
    }
    protected initHandler(handler: IHandler[]){
        handler.map(x=>{
            this.defaultApps.use('/api/v1', x.router)
        })
    }
    protected async initConnection(){
        const conn = await this.db.connect()
        if (conn) {
            console.log('Connect to Database');
        }
    }
}

const app = new App([
    new UserHandler(),
])

app.defaultApps.listen(process.env.PORT||5000,()=>{
    console.log(`Apps Running at PORT ${process.env.PORT||5000}`);
})