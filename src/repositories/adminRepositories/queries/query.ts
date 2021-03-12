import { QueryProxy } from '../../../utils/database/mongodb/queryProxy';
import { ObjectId } from "mongodb";
export default interface IQuery{
    findOne(payload: any): any
}

export class Query implements IQuery {
    db: QueryProxy
    constructor() {
        this.db = new QueryProxy()
    }
    
    async findOne(param: any){
        this.db.setCollection('user')
        const result = await this.db.findOne(param)
        console.log(result);
        
        return result
    }
    async findMetaDashboard(param: any){
        this.db.setCollection('user')
        const petugas: any = await this.db.count({role:'petugas'})
        const user: any = await this.db.count({role:'user'})

        const meta = {
            totalPetugas: petugas.data,
            totalUser: user.data,
        }
        return meta
    }
}