import { Wrapper } from '../../../utils/helpers/wrapper';
import { Query } from './query';

export default interface IQueryWorker{
    getPetugasPagination(payload: { page: number, limit: number, search: any }): any
}

export class QueryWorker implements IQueryWorker{
    query: Query
    wrapper: Wrapper
    constructor() {
        this.query = new Query()
        this.wrapper = new Wrapper()
    }

    async getPetugasById(payload: string){
        const result = await this.query.findById(payload)
        if (result.err) {
            return this.wrapper.error('Petugas Not Found')
        }
        return this.wrapper.data(result.data)
    }
    
    async getPetugasPagination(payload: { page: number, limit: number, search: any }) {
        let { page, limit, search } = payload
        page = (!page) ? 1 : page;
        limit = (!limit) ? 10 : limit;
        const params: any[] = []
        const searchData = new RegExp(search, 'i');
        const searchUsername = new RegExp(search, 'i');
        const $match = {
            $and: [{
                $or: [
                    { name: searchData },
                    { username: searchUsername }
                ]
            },
            { accessRole : 'Petugas' }]
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