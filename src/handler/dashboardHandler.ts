import { Router, Request, Response } from 'express';
import { IHandler } from '../shared/IHandler';
import { CommandWorker } from '../repositories/dashboardRepositories/commands/commandWorker';
import { QueryWorker } from '../repositories/dashboardRepositories/queries/queryWorker';
import { Wrapper } from '../utils/helpers/wrapper';
import { auth } from '../utils/auth/jwtAuth'

export default class DashboardHandler implements IHandler{
    path = '/dashboard'
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
        this.router.get(`${this.path}/`,auth, this.dashboard)
    }

    private dashboard = async(req: Request, res: Response)=>{
        const payload = req.query
        
        const postRequest = async()=>{
            return this.query.getDashboard(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.response(res, 'fail', result, 'Failed Get Data User', 400)
            : this.wrapper.response(res, 'success', result, 'Success Get Data User', 200);
        }
        response(await postRequest())
    }

}