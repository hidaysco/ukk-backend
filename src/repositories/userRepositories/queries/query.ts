import { QueryProxy } from '../../../utils/database/mysql/queryProxy';
export default interface IQuery{
    getUserPagination(payload: any): any
    findMeta(payload: any):any
    getOneUserByUsername(param: any): any
}

export class Query implements IQuery {
    db: QueryProxy
    constructor() {
        this.db = new QueryProxy()
    }
    
    async getUserPagination(param: any){
        const page = (param.page-1)*param.limit 
        const limit = param.limit
        const query = `SELECT * FROM user LIMIT ${limit} OFFSET ${page}`
        const result = await this.db.query(query)
        return result
    }

    async findMeta(param: any){
        const query = 'SELECT COUNT (username) AS total FROM user'
        const result: any = await this.db.query(query)
        const meta = {
            totalData: result.data[0].total,
            totalPage: Math.ceil(result.data[0].total/param.limit),
            page: Number(param.page),
            size: Number(param.limit)
        }
        return meta
    }

    async getOneUserByUsername(param: any){
        const query = 'SELECT * FROM user WHERE username = ?'
        const result = await this.db.query(query, param)
        return result
    }
}