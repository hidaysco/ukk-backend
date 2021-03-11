import { Router, Request, Response } from 'express';
import { IHandler } from '../shared/IHandler';
import { CommandWorker } from '../repositories/adminRepositories/commands/commandWorker';
import { QueryWorker } from '../repositories/adminRepositories/queries/queryWorker';
import { Wrapper } from '../utils/helpers/wrapper';
import { auth } from '../utils/auth/jwtAuth'

export default class AdminHandler implements IHandler{
    path = '/admin'
    router = Router()
    command: CommandWorker
    query: QueryWorker
    wrapper: Wrapper
    constructor() {
        this.initRouter()
        this.command = new CommandWorker()
        this.query = new QueryWorker()
        this.wrapper = new Wrapper()
    }

    private initRouter(){
        this.router.get(`${this.path}/dashboard`, this.dashboard)
        this.router.post(`${this.path}/register`, this.registerPetugas)
        this.router.delete(`${this.path}/delete/:id`, this.deleteOne)
        this.router.put(`${this.path}/update/`, auth, this.updatePetugas)
        this.router.get(`${this.path}/`, auth, this.getPagination)
        // this.router.post(`${this.path}/login`, this.loginPetugas)
    }

    private dashboard = async(req: Request, res: Response)=>{
        // const payload = req.query
        // console.log(payload);
        
        // payload.accessRole = req.user.role
        
        const postRequest = async()=>{
            return this.query.getPetugasPagination({})
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.paginationResponse(res, 'fail', result, 'Failed Get Data User', 400)
            : this.wrapper.paginationResponse(res, 'success', result, 'Success Get Data User', 200);
        }
        response(await postRequest())
    }

    private registerPetugas = async(req: Request, res: Response)=>{
        const payload = req.body
        console.log(payload);
        
        const postRequest = async()=>{
            return this.command.registerPetugas(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.response(res, 'fail', result, `Failed Create Data ${payload.level}`, 400)
            : this.wrapper.response(res, 'success', result, `Success Create Data ${payload.level}`, 201);
        }
        response(await postRequest())
    }

    private deleteOne = async(req: Request, res: Response)=>{
        const payload = req.params.id
        const postRequest = async()=>{
            return this.command.deleteUser(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.response(res, 'fail', result, 'Failed Delete Data User', 400)
            : this.wrapper.response(res, 'success', result, 'Success Delete Data User', 200);
        }
        response(await postRequest())
    }

    private updatePetugas = async(req: Request, res: Response)=>{
        const payload = req.body
        // console.log(payload);
        
        payload.id = req.user._id
        
        const postRequest = async()=>{
            return this.command.updateOne(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.response(res, 'fail', result, 'Failed Update Data User', 400)
            : this.wrapper.response(res, 'success', result, 'Success Update Data User', 200);
        }
        response(await postRequest())
    }

    private getPagination = async(req: Request, res: Response)=>{
        const payload = req.query
        payload.accessRole = req.user.accessRole
        
        const postRequest = async()=>{
            return this.query.getPetugasPagination(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.paginationResponse(res, 'fail', result, 'Failed Get Data User', 400)
            : this.wrapper.paginationResponse(res, 'success', result, 'Success Get Data User', 200);
        }
        response(await postRequest())
    }

    // private loginPetugas = async(req: Request, res: Response)=>{
    //     const payload = req.body
    //     const postRequest = async()=>{
    //         return this.command.loginPetugas(payload)
    //     }
    //     const response = (result: { err: any })=>{
    //         (result.err) ? this.wrapper.response(res, 'fail', result, 'Failed Login Data User', 400)
    //         : this.wrapper.response(res, 'success', result, 'Success Login Data User', 200);
    //     }
    //     response(await postRequest())
    // }
}