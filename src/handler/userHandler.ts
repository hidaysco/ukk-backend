import { Router, Request, Response } from 'express';
import { IHandler } from '../shared/IHandler';
import { QueryWorker } from '../repositories/userRepositories/queries/queryWorker';
import { CommandWorker } from '../repositories/userRepositories/commands/commandWorker';
import { Wrapper } from '../utils/helpers/wrapper';
import { auth } from '../utils/auth/jwtAuth'

export default class UserHandler implements IHandler{
    path = '/users'
    router = Router()
    query: QueryWorker
    command: CommandWorker
    wrapper: Wrapper
    constructor() {
        this.initRouter()
        this.query = new QueryWorker()
        this.command = new CommandWorker()
        this.wrapper = new Wrapper()
    }

    private initRouter(){
        this.router.post(`${this.path}/register`, this.registerUser)
        this.router.post(`${this.path}/login`, this.loginUser)
        this.router.get(`${this.path}/`, auth, this.getUserPagination)
    }

    private getUserPagination = async(req: Request,res: Response)=>{
        const payload = req.query
        const postRequest = async()=>{
            return this.query.getUserPagination(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.paginationResponse(res, 'fail', result, 'Failed Get Data User', 400)
            : this.wrapper.paginationResponse(res, 'success', result, 'Success Get Data User', 200);
        }
        response(await postRequest())
    }

    private registerUser = async(req: Request, res: Response)=>{
        const payload = req.body
        const postRequest = async()=>{
            return this.command.registerUser(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.response(res, 'fail', result, 'Failed Create Data User', 400)
            : this.wrapper.response(res, 'success', result, 'Success Create Data User', 201);
        }
        response(await postRequest())
    }

    private loginUser = async(req: Request, res: Response)=>{
        const payload = req.body
        const postRequest = async()=>{
            return this.command.loginUser(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.response(res, 'fail', result, 'Failed Login User', 400)
            : this.wrapper.response(res, 'success', result, 'Success Login User', 201);
        }
        response(await postRequest())
    }
}