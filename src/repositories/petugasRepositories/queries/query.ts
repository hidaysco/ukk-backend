import { QueryProxy } from '../../../utils/database/mongodb/queryProxy';
import { ObjectId } from "mongodb";
export default interface IQuery{
    findById(data: string): void
    findMeta(param: any): void
    findAggregate(param: any[]):void
}

export class Query implements IQuery {
    db: QueryProxy
    constructor() {
        this.db = new QueryProxy()
    }

    async findOnePetugas(param: Object){
        this.db.setCollection('user')
        const result = await this.db.findOne(param)
        return result
    }
    
    async findById(data: string){
        this.db.setCollection('user')
        const param = {
            _id: new ObjectId(data)
        }
        const result = await this.db.findOne(param)
        return result
    }

    async findMeta(param: any){
        this.db.setCollection('user')
        const{ paramData, page, limit } = param
        const result: any = await this.db.count(paramData)
        const meta = {
            totalData: result.data,
            lastPage: Math.ceil(result.data/limit),
            page: page,
            size: limit
        }
        return meta
    }

    async findAggregate(param: any[]){
        this.db.setCollection('user')
        const result = await this.db.aggregate(param)
        
        return result
    }
}