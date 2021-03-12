import {QueryProxy}from '../../../utils/database/mongodb/queryProxy'
import { ObjectId } from "mongodb";
export default interface IQuery {
    insertOne(data: object): object
}
export class Command implements IQuery {
    db: QueryProxy
    constructor(){
        this.db = new QueryProxy()
    }

    async insertOne(data: object) {
        this.db.setCollection('user')
        const result = await this.db.insertOne(data)
        return result
    }
}