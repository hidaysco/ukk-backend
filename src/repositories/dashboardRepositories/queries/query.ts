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

        const result:any = await this.db.count(param)
        return result
    }
    async countAkun(param: any){
        this.db.setCollection('user')
        
        const result: any = await this.db.count(param)
        return result
    }
}