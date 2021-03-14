import { Router, Request, Response } from 'express';
import { IHandler } from '../shared/IHandler';
import { CommandWorker } from '../repositories/adminRepositories/commands/commandWorker';
import { Wrapper } from '../utils/helpers/wrapper';
import { auth } from '../utils/auth/jwtAuth'

export default class AdminHandler implements IHandler{
    path = '/admin'
    router = Router()
    command: CommandWorker
    wrapper: Wrapper
    constructor() {
        this.initRouter()
        this.command = new CommandWorker()
        this.wrapper = new Wrapper()
    }

    private initRouter(){
        this.router.post(`${this.path}/register`, this.registerAdmin)
    }

    private registerAdmin = async(req: Request, res: Response)=>{
        const payload = req.body
        
        const postRequest = async()=>{
            return this.command.registerAdmin(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.response(res, 'fail', result, 'Failed Register Data Admin', 400)
            : this.wrapper.response(res, 'success', result, 'Success Register Data Admin', 201);
        }
        response(await postRequest())
    }

}