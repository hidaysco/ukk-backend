import {QueryProxy}from '../../../utils/database/mongodb/queryProxy'
export default interface IQuery {
    insertOne(data: any): any
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
}