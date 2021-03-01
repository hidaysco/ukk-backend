import express from 'express';
import { IHandler } from './shared/IHandler';
import UserHandler from './handler/userHandler';
import {MySQL} from './utils/database/mysql/connection';
import bodyParser from "body-parser";
require('dotenv').config();

class App {
    defaultApps: express.Application
    db: MySQL
    constructor(handler:IHandler[]) {
        this.defaultApps = express()
        this.initPlugin()
        this.initHandler(handler)
        this.db = new MySQL()
        this.initConnection()
    }
    protected initPlugin(){
        this.defaultApps.use(bodyParser.json())
        this.defaultApps.use(bodyParser.urlencoded({extended:true}))
    }
    protected initHandler(handler: IHandler[]){
        handler.map(x=>{
            this.defaultApps.use('/api/v1', x.router)
        })
    }
    protected initConnection(){
        this.db.getConnetion()
    }
}

const app = new App([
    new UserHandler()
])

app.defaultApps.listen(process.env.PORT||5000,()=>{
    console.log(`Apps Running at PORT ${process.env.PORT||5000}`);
})