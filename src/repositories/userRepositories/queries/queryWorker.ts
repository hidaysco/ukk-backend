import { Wrapper } from '../../../utils/helpers/wrapper';
import { Query } from './query';

export default interface IQueryWorker{
    getUserPagination(payload: any): any
}

export class QueryWorker implements IQueryWorker{
    query: Query
    wrapper: Wrapper
    constructor() {
        this.query = new Query()
        this.wrapper = new Wrapper()
    }
    
    async getUserPagination(payload: any) {
        let {page} =payload
        const meta: any= await this.query.findMeta(payload)
        page = (page < 1 ? meta.totalPage : meta.totalPage < page ? 1 : page);
        payload.page = page
        const result: any = await this.query.getUserPagination(payload)
        return this.wrapper.pagination(result.data, meta)
    }
}