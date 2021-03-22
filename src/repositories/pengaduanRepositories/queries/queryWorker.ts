import { Wrapper } from '../../../utils/helpers/wrapper';
import { Query } from './query';
import XLSX from "xlsx";
import { wrap } from 'node:module';

export default interface IQueryWorker{
    getPengaduanPagination(payload: { page: number, limit: number, search: any, status: any }): any
    getPengaduanById(payload: string): any
    downloadPengaduan():any
    getTotalData(user: any): any
}

export class QueryWorker implements IQueryWorker{
    query: Query
    wrapper: Wrapper
    constructor() {
        this.query = new Query()
        this.wrapper = new Wrapper()
    }
    
    async getPengaduanPagination(payload: { page: number, limit: number, search: any , status: any, user: any }) {
        let { page, limit, search, status, user } = payload
        page = (!page) ? 1 : page;
        limit = (!limit) ? 10 : limit;
        const params: any[] = []
        const searchData = new RegExp(search, 'i');
        let $match, $filter: any[] = []
        if (searchData) {
            $filter.push({title: searchData})
        }
        switch (status) {
            case 'history':
                $filter.push({ 
                    $or:[{ status: 'Approved' }, { status: 'Rejected' }]
                })
                break;
            case 'approved':
                $filter.push({'status': 'Approved'})
                break;
            case 'rejected':
                $filter.push({'status': 'Rejected'})
                break;
            case 'pending':
                $filter.push({'status': 'Pending'})
                break;
            default:
                $filter.push({'status': 'Pending'})
                break;
        }
        if (status === 'history' && user.accessRole === 'User') {
            $filter.push({'createdBy.nik': user.nik})
        }
        if ($filter.length>0) {
            $match = ({
                $and: $filter
            })
            params.push({$match: $match})
        }
        if (status === 'history') {
            params.push({ $sort: {updatedAt: -1 }})
        }else{
            params.push({ $sort:{ createdAt: -1 }})
        }
        
        const meta: any= await this.query.findMeta({ paramData: $match, limit, page })
        page = (page < 1 ? meta.totalPage : meta.totalPage < page ? 1 : page);    
        params.push({ $skip: (page - 1) * limit });
        params.push({ $limit: limit });
        const result: any = await this.query.findAggregate(params)
        
        return this.wrapper.pagination(result.data, meta)
    }

    async getPengaduanById(payload: string){
        const result = await this.query.findById(payload)
        if (result.err) {
            return this.wrapper.error('Pengaduan Not Found')
        }
        return this.wrapper.data(result.data)
    }

    async downloadPengaduan() {
        const param = [
            {
                $match: {
                    $and: [{
                        $or:[{ status: 'Approved' }, { status: 'Rejected' }]
                    }]
                }
            },
            { $project: {
                title: '$title',
                description: '$description',
                status: '$status',
                createdAt: {$dateToString: { format: '%d-%m-%Y', date: '$createdAt' }},
                updatedAt: {$dateToString: { format: '%d-%m-%Y', date: '$updatedAt' }}
            }},

        ]
        const result = await this.query.findAggregate(param)
        if (result.err) {
            return this.wrapper.error('Data Not Found')
        }
        const data  = XLSX.utils.json_to_sheet(result.data)
        const workbook: XLSX.WorkBook = { Sheets: { 'data': data }, SheetNames: ['data'] };
        let location = __dirname
        const file = Date.now()+'-pengaduan.xlsx'
        location = location+'/'+file
        XLSX.writeFile(workbook, location)
        return this.wrapper.data(location)
    }

    async getTotalData(user: any) {
        let queryHistory
        if (user.accessRole === 'User') {
            queryHistory = {
                $and: [{
                    $or: [
                        {status: 'Rejected'},
                        {status: 'Approved'}
                    ]
                },{'createdBy.nik': user.nik}]
            }
        }else{
            queryHistory = {
                $or: [
                    {status: 'Rejected'},
                    {status: 'Approved'}
                ]
            }
        }
        const pengaduan: any= await this.query.count({status:'Pending'})
        const history: any= await this.query.count(queryHistory)
        
        const result = {
            totalPengaduan: pengaduan,
            totalHistory: history
        }
        
        return this.wrapper.data(result)
    }
}
