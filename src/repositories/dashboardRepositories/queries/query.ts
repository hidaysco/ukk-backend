import { QueryProxy } from '../../../utils/database/mongodb/queryProxy';
import { ObjectId } from "mongodb";
export default interface IQuery{
    findOne(payload: any): any
    findMetaDashboard(payload: any): any
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
        const petugas: any = await this.db.count({accessRole:'Petugas'})
        const user: any = await this.db.count({accessRole:'User'})

        this.db.setCollection('pengaduan')
        const pending:any = await this.db.count({status:'Pending'})
        const approved:any = await this.db.count({status:'Approved'})
        const rejected:any = await this.db.count({status:'Rejected'})

        const meta = {
            totalPetugas: petugas.data,
            totalUser: user.data,
            totalPending: pending.data,
            totalApproved: approved.data,
            totalRejected: rejected.data
        }
        return meta
    }
}