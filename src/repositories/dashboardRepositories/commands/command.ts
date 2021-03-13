import {QueryProxy}from '../../../utils/database/mongodb/queryProxy'
import { ObjectId } from "mongodb";
export default interface IQuery {
}
export class Command implements IQuery {
    db: QueryProxy
    constructor(){
        this.db = new QueryProxy()
    }
}