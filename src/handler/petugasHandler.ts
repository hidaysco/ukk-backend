import { Router, Request, Response } from 'express';
import { IHandler } from '../shared/IHandler';
import { CommandWorker } from '../repositories/petugasRepositories/commands/commandWorker';
import { QueryWorker } from '../repositories/petugasRepositories/queries/queryWorker';
import { Wrapper } from '../utils/helpers/wrapper';
import { auth } from '../utils/auth/jwtAuth'

export default class PetugasHandler implements IHandler{
    path = '/petugas'
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
        this.router.post(`${this.path}/register`,auth, this.registerPetugas)
        this.router.delete(`${this.path}/delete/:id`,auth, this.deleteOne)
        this.router.put(`${this.path}/update/:id`, auth, this.updatePetugas)
        this.router.get(`${this.path}/`, auth, this.getPagination)
    }

    private registerPetugas = async(req: Request, res: Response)=>{
        const payload = req.body
        payload.user = req.user.accessRole
        const postRequest = async()=>{
            return this.command.registerPetugas(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.response(res, 'fail', result, `Failed Create Data Petugas`, 400)
            : this.wrapper.response(res, 'success', result, `Success Create Data Petugas`, 201);
        }
        response(await postRequest())
    }

    private deleteOne = async(req: Request, res: Response)=>{
        const payload = {
            id: req.params.id,
            accessRole: req.user.accessRole
        }

        const postRequest = async()=>{
            return this.command.deletePetugas(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.response(res, 'fail', result, 'Failed Delete Data User', 400)
            : this.wrapper.response(res, 'success', result, 'Success Delete Data User', 200);
        }
        response(await postRequest())
    }

    private updatePetugas = async(req: Request, res: Response)=>{
        const payload = req.body
        payload.id = req.params.id
        payload.accessRole = req.user.accessRole
        
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
        
        const postRequest = async()=>{
            return this.query.getPetugasPagination(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.paginationResponse(res, 'fail', result, 'Failed Get Data User', 400)
            : this.wrapper.paginationResponse(res, 'success', result, 'Success Get Data User', 200);
        }
        response(await postRequest())
    }
}