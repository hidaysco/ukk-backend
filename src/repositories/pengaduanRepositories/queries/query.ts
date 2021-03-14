import { QueryProxy } from '../../../utils/database/mongodb/queryProxy';
import { ObjectId } from "mongodb";
export default interface IQuery{
    findOnePengaduan(payload: any): any
    findById(payload: string):any
    findMeta(payload: any): any
    findAggregate(payload: any[]): any
}

export class Query implements IQuery {
    db: QueryProxy
    constructor() {
        this.db = new QueryProxy()
    }
    
    async findOnePengaduan(param: any){
        this.db.setCollection('pengaduan')
        const result = await this.db.findOne(param)
        return result
    }

    async findById(data: string){
        this.db.setCollection('pengaduan')
        const param = {
            _id: new ObjectId(data)
        }
        const result = await this.db.findOne(param)
        return result
    }

    async findMeta(param: any){
        this.db.setCollection('pengaduan')
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
        this.db.setCollection('pengaduan')
        const result = await this.db.aggregate(param)
        return result
    }

    async findMany(param: any){
        this.db.setCollection('pengaduan')
        const result = await this.db.find(param)
        return result
    }
}