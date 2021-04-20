import { Wrapper } from "../../../utils/helpers/wrapper";
import { Command } from "./command";
import { Query } from "../queries/query";
import { promises as fs } from "fs";
export default interface ICommandWorker {
    submitPengaduan(payload: any): any
    updateStatus(payload: { id: string; status: string; note: string; accessRole: string; }): any
}

export class CommandWorker implements ICommandWorker {
    command: Command
    query: Query
    wrapper: Wrapper
    constructor() {
        this.command = new Command()
        this.query = new Query()
        this.wrapper = new Wrapper()
    }

    async submitPengaduan(payload: any) {
        const { title, description, photos, user } = payload
        if (user.accessRole !== 'User') {
            photos.map((x: any)=>{
                fs.unlink(x.path)
            })
            return this.wrapper.error(`This Role Can't Submit Pengaduan`)
        }
        if (photos.length === 0) {
            return this.wrapper.error('Foto must be filled')
        }
        const createdBy = {
            name: user.name,
            nik: user.nik
        }
        let file: any[] = []
        photos.map((x: any) => {
            file.push({ fileName: x.filename, size: x.size })
        })
        const data = {
            title,
            description,
            status: 'Pending',
            file,
            createdBy,
            createdAt: new Date(Date.now())
        }
        const result = await this.command.insertOne(data)
        if (result.err) {
            return this.wrapper.error(result)
        }
        return this.wrapper.data(data)
    }

    async updateStatus(payload: { id: string; status: string; note: string; accessRole: string; }) {
        const { id, status, note, accessRole } = payload

        if (accessRole !== 'Admin' && accessRole !== 'Petugas') {
            return this.wrapper.error('Only Admin and Petugas Update Status Pengaduan')
        }
        const checkPengaduan = await this.query.findById(id)
        if (checkPengaduan.err) {
            return this.wrapper.error('Pengaduan Not Found')
        }
        const data = checkPengaduan.data
        if (note) {
            data.note = note
        }
        switch (status) {
            case 'approve':
                data.status = "Approved"
                break;
            case 'reject':
                data.status = "Rejected"
                break;
            case 'onprogress':
                data.status = "On Progress"
                break;
            default:
                data.status = "Pending"
                break;
        }
        data.updatedAt = new Date(Date.now())
        const update = await this.command.updateOne(id, {$set: data})
        if (update.err) {
            return this.wrapper.error('Failed Update Data')
        }

        return this.wrapper.data(update.data)
    }
}