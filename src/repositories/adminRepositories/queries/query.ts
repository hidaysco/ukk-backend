import { QueryProxy } from '../../../utils/database/mongodb/queryProxy';
import { ObjectId } from "mongodb";
export default interface IQuery{
    findOnePetugas(payload: any): any
    // checkLevel(payload :any):any
    // findMeta(payload: any):any
    // getOneUserByUsername(param: any): any
}

export class Query implements IQuery {
    db: QueryProxy
    constructor() {
        this.db = new QueryProxy()
    }
    
    async findOnePetugas(param: any){
        this.db.setCollection('users')
        const result = await this.db.findOne(param)
        console.log(result);
        
        return result
    }

    // async checkLevel (param:any) {
    //     var level = ['petugas']
    //     var checkLevel = new Set(level)
    //     const result =  checkLevel.has(param.level)
    //     // console.log(param);
    //     return result
    // }

    async findById(data: any){
        this.db.setCollection('users')
        const param = {
            _id: new ObjectId(data)
        }
        const result = await this.db.findOne(param)
        return result
    }

    async findMetaDashboard(param: any){
        this.db.setCollection('users')
        const petugas: any = await this.db.count({role:'petugas'})
        const user: any = await this.db.count({role:'user'})

        const meta = {
            totalPetugas: petugas.data,
            totalUser: user.data,
        }
        return meta
    }

    async findMeta(param: any){
        this.db.setCollection('users')
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

    async findAggregate(param: any){
        this.db.setCollection('users')
        const result = await this.db.aggregate(param)
        // console.log(param);
        
        return result
    }
}