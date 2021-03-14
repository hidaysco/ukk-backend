import { Wrapper } from '../../../utils/helpers/wrapper';
import { Query } from './query';

export default interface IQueryWorker{
    getDashboard(payload: any): any
}

export class QueryWorker implements IQueryWorker{
    query: Query
    wrapper: Wrapper
    constructor() {
        this.query = new Query()
        this.wrapper = new Wrapper()
    }
    
    async getDashboard(payload: any) {
        const petugas: any= await this.query.countAkun({accessRole:'Petugas'})
        const user: any= await this.query.countAkun({accessRole:'User'})
        const pengaduan: any= await this.query.countPengaduan({status:'Pending'})
        const approved: any= await this.query.countPengaduan({status:'Approved'})
        const rejected: any= await this.query.countPengaduan({status:'Rejected'})
        
        const result = {
            totalPengaduan: pengaduan.data,
            totalApproved: approved.data,
            totalRejected: rejected.data,
            totalPetugas: petugas.data,
            totalUser: user.data
        }
        
        return this.wrapper.data(result)
    }

}