export interface IWrapper{
    data(data:any):any
    error(data:any):any
    pagination(data: any, meta:{
        totalData: Number,
        totalPage: Number,
        page: Number,
        size: Number
    }):any
    response(res: any, type: any, result: any, message: String, code: Number):any
    paginationResponse(res: any, type: any, result: any,message: String, code: Number):any
}

export class Wrapper implements IWrapper {
    constructor() {

    }
    data = (data: any)=> ({err: null,data})
    error = (data:any)=>({err: data.err||data, data: null})
    pagination = (data: any, meta: { totalData: Number, totalPage: Number, page: Number, size: Number}) => ({
        err: null,
        data,
        meta
    })
    response = (res: any, type: any, result: any, message: String, code: Number)=>{
        let status = true;
        let data= result.data;
        if(type === 'fail'){
            status = false;
            data = '';
            message = result.err.message || result.err || message;
            code = code;
        }
        res.status(code).send({
            status,
            data,
            message,
            code
        })
    }
    paginationResponse = (res: any, type: any, result: any, message: String, code: Number)=>{
        let status = true;
        let data= result.data;
        if(type === 'fail'){
            status = false;
            data = '';
            message = result.err.message || message;
            code = code;
        }
        res.status(code).send({
            status,
            data,
            meta: result.meta,
            message,
            code
        })
    }
}
