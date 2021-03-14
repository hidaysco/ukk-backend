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
        const akun: any= await this.query.countAkun({})
        const pengaduan: any= await this.query.countPengaduan({})
        
        const result = {
            totalPengaduan: pengaduan.totalPengaduan,
            totalApproved: pengaduan.totalApproved,
            totalRejected: pengaduan.totalRejected,
            totalPetugas: akun.totalPetugas,
            totalUser: akun.totalUser
        }
        
        return this.wrapper.data(result)
    }

}