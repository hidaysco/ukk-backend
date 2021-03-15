import { Router, Request, Response, NextFunction, query } from 'express';
import { IHandler } from '../shared/IHandler';
import { CommandWorker } from '../repositories/pengaduanRepositories/commands/commandWorker';
import { QueryWorker } from '../repositories/pengaduanRepositories/queries/queryWorker';
import { Wrapper } from '../utils/helpers/wrapper';
import { auth } from '../utils/auth/jwtAuth'
import { upload } from '../utils/infra/multer'

export default class PengaduanHandler implements IHandler{
    path = '/pengaduan'
    router = Router()
    command: CommandWorker
    query: QueryWorker
    wrapper: Wrapper
    constructor() {
        this.command = new CommandWorker()
        this.query = new QueryWorker()
        this.wrapper = new Wrapper()
        this.initRouter()
    }
    
    private initRouter(){
        this.router.post(`${this.path}/submit-pengaduan`, auth, upload.array('photos'), this.submitPengaduan)
        this.router.get(`${this.path}/`, auth, this.getPengaduan)
        this.router.get(`${this.path}/download-pengaduan`, auth,  this.downloadPengaduan)
        this.router.get(`${this.path}/:id`, auth, this.getPengaduanById)
        this.router.put(`${this.path}/update-status/:id`, auth, this.updateStatus)
    }

    private submitPengaduan = async(req: Request, res: Response)=>{
        const payload = req.body
        payload.photos = req.files
        payload.user = req.user
        const postRequest = async()=>{
            return this.command.submitPengaduan(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.response(res, 'fail', result, `Failed Create Data`, 400)
            : this.wrapper.response(res, 'success', result, `Success Create Data`, 201);
        }
        response(await postRequest())
    }

    private getPengaduan = async(req: Request, res: Response)=>{
        const payload = {
            limit: Number(req.query.limit),
            page: Number(req.query.page),
            search: req.query.search,
            status: String(req.query.status)
        }
        const postRequest = async()=>{
            return this.query.getPengaduanPagination(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.paginationResponse(res, 'fail', result, `Failed Get Data`, 400)
            : this.wrapper.paginationResponse(res, 'success', result, `Success Get Data`, 200);
        }
        response(await postRequest())
    }

    private getPengaduanById = async(req: Request, res: Response)=>{
        const payload = req.params.id
        const postRequest = async()=>{
            return this.query.getPengaduanById(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.response(res, 'fail', result, `Failed Get Data`, 400)
            : this.wrapper.response(res, 'success', result, `Success Get Data`, 200);
        }
        response(await postRequest())
    }

    private updateStatus = async(req: Request, res: Response)=>{
        const payload = req.body
        payload.accessRole = req.user.accessRole
        payload.id = req.params.id
        const postRequest = async()=>{
            return this.command.updateStatus(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.paginationResponse(res, 'fail', result, `Failed Update Data`, 400)
            : this.wrapper.paginationResponse(res, 'success', result, `Success Update Data`, 200);
        }
        response(await postRequest())
    }

    private downloadPengaduan = async(req: Request, res: Response)=>{
        const payload = req.user.accessRole
        
        const postRequest = async()=>{
            return this.query.downloadPengaduan(payload)
        }
        const response = (result: { err: any })=>{
            (result.err) ? this.wrapper.downloadResponse(res, 'fail', result, `Failed Update Data`, 400)
            : this.wrapper.downloadResponse(res, 'success', result, `Success Update Data`, 200);
        }
        response(await postRequest())
    }
}