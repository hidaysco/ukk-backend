import {QueryProxy}from '../../../utils/database/mongodb/queryProxy'
import { ObjectId } from "mongodb";
export default interface IQuery {
    insertOne(data: any): any
    deleteOne(data: any): any
    updateOne(id:any, data: any): any
}
export class Command implements IQuery {
    db: QueryProxy
    constructor(){
        this.db = new QueryProxy()
    }

    async insertOne(data: any) {
        this.db.collectionName = 'users'
        const result = await this.db.insertOne(data)
        return result
    }

    async deleteOne(data: any) {
        this.db.collectionName = 'users'
        const param = {
           _id: new ObjectId(data)
        }
        const result = await this.db.deleteOne(param)
        return result
    }

    async updateOne(id: any,data: any) {
        this.db.collectionName = 'users'
        const param = {
           _id: new ObjectId(id)
        }
        const result = await this.db.updateOne(param, data)
        return result
    }
}