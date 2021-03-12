import { Router, Request, Response } from 'express';
import { IHandler } from '../shared/IHandler';
import { CommandWorker } from '../repositories/userRepositories/commands/commandWorker';
import { QueryWorker } from '../repositories/userRepositories/queries/queryWorker';
import { Wrapper } from '../utils/helpers/wrapper';
import { auth } from '../utils/auth/jwtAuth'

export default class UserHandler implements IHandler{
    path = '/users'
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
        this.router.post(`${this.path}/register`, this.registerUser)
        this.router.delete(`${this.path}/delete/:id`, this.deleteOne)
        this.router.put(`${this.path}/update/`, auth, this.updateOne)
        this.router.get(`${this.path}/`, auth, this.getPagination)
        this.router.post(`${this.path}/login`, this.loginUser)
    }

    private registerUser = async(req: Request, res: Response)=>{
        const payload: any = req.body
        const postRequest = async()=>{
            return this.command.registerUser(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.response(res, 'fail', result, 'Failed Create Data User', 400)
            : this.wrapper.response(res, 'success', result, 'Success Create Data User', 201);
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

    private updateOne = async(req: Request, res: Response)=>{
        const payload = req.body
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
            return this.query.getUserPagination(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.paginationResponse(res, 'fail', result, 'Failed Get Data User', 400)
            : this.wrapper.paginationResponse(res, 'success', result, 'Success Get Data User', 200);
        }
        response(await postRequest())
    }

    private loginUser = async(req: Request, res: Response)=>{
        const payload = req.body
        const postRequest = async()=>{
            return this.command.loginUser(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.response(res, 'fail', result, 'Failed Login Data User', 400)
            : this.wrapper.response(res, 'success', result, 'Success Login Data User', 200);
        }
        response(await postRequest())
    }
}