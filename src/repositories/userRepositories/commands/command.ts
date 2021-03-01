import { QueryProxy } from '../../../utils/database/mysql/queryProxy';
export default interface ICommand{
    insertOne(param: any):any
}

export class Command implements ICommand {
    db: QueryProxy
    constructor() {
        this.db = new QueryProxy()
    }
    
    async insertOne(param: any){
        const query = 'INSERT INTO user SET ?'
        const result = await this.db.query(query, param)
        return result
    }
}