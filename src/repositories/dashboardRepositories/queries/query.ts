import { QueryProxy } from '../../../utils/database/mongodb/queryProxy';
import { ObjectId } from "mongodb";
export default interface IQuery{
    countAkun(payload: any): any
    countPengaduan(payload: any): any
}

export class Query implements IQuery {
    db: QueryProxy
    constructor() {
        this.db = new QueryProxy()
    }

    async countPengaduan(param:any){
        this.db.setCollection('pengaduan')

        const pending:any = await this.db.count({status:'Pending'})
        const approved:any = await this.db.count({status:'Approved'})
        const rejected:any = await this.db.count({status:'Rejected'})

        const meta = {
            totalPengaduan: pending.data,
            totalApproved: approved.data,
            totalRejected: rejected.data
        }
        return meta
    }
    async countAkun(param: any){
        this.db.setCollection('user')
        const petugas: any = await this.db.count({accessRole:'Petugas'})
        const user: any = await this.db.count({accessRole:'User'})

        const meta = {
            totalPetugas: petugas.data,
            totalUser: user.data
        }
        return meta
    }
}