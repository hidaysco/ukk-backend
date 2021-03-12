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
        const meta: any= await this.query.findMetaDashboard({})
        
        return this.wrapper.data(meta)
    }

}