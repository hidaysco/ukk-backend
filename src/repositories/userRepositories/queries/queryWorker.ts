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
        let { page, limit, search } =payload
        page = (!page) ? 1 : parseInt(page);
        limit = (!limit) ? 10 : parseInt(limit);
        const params: any[] = []
        const searchData = new RegExp(search, 'i');
        const searchNik = parseFloat(search);
        const $match = {
            $and: [{
                $or: [
                    { name: searchData },
                    { nik: searchNik }
                ]
            }]
        }
        params.push({$match: $match})
        params.push({$sort: {cratedAt: -1}})
        const meta: any= await this.query.findMeta({ paramData: $match, limit, page })
        page = (page < 1 ? meta.totalPage : meta.totalPage < page ? 1 : page);    
        params.push({ $skip: (page - 1) * limit });
        params.push({ $limit: limit });
        
        const result: any = await this.query.findAggregate(params)
        
        return this.wrapper.pagination(result.data, meta)
    }
}