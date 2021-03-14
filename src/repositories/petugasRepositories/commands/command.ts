import {QueryProxy}from '../../../utils/database/mongodb/queryProxy'
import { ObjectId } from "mongodb";
export default interface IQuery {
    insertOne(data: any): any
    deleteOne(data: string): any
    updateOne(id:string, data: any): any
}
export class Command implements IQuery {
    db: QueryProxy
    constructor(){
        this.db = new QueryProxy()
    }

    async insertOne(data: any) {
        this.db.setCollection('user')
        const result = await this.db.insertOne(data)
        return result
    }

    async deleteOne(data: string) {
        this.db.setCollection('user')
        const param = {
           _id: new ObjectId(data)
        }
        const result = await this.db.deleteOne(param)
        return result
    }

    async updateOne(id: string, data: any) {
        this.db.setCollection('user')
        const param = {
           _id: new ObjectId(id)
        }
        const result = await this.db.updateOne(param, data)
        return result
    }
}