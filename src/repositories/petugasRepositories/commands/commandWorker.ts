import { Wrapper } from '../../../utils/helpers/wrapper';
import { Command } from './command';
import { Query } from '../queries/query';
import bcryptjs from "bcryptjs";

export default interface ICommandWorker{
    registerPetugas(payload: { name: string, username: string, password: string, telp: string, accessRole: string} ): any
    deletePetugas(payload: {id: string, accessRole: string} ): any
    updateOne(payload: { id: string, name: string, username: string, password: string, telp: string, accessRole: string} ): any
}

export class CommandWorker implements ICommandWorker{
    command: Command
    query: Query
    wrapper: Wrapper
    bcrypt = bcryptjs
    constructor() {
        this.command = new Command()
        this.query = new Query()
        this.wrapper = new Wrapper()
    }

    async registerPetugas(payload: { name: string, username: string, password: string, telp: string, accessRole: string}) {
        let { name, username, password, telp, accessRole }= payload
        if (accessRole !== 'Admin') {
            return this.wrapper.error(`This Role Can't Register Petugas`)
        }
        const checkUser: any = await this.query.findOnePetugas({username})
        if (checkUser.data) {
            return this.wrapper.error('Username Already Registered')
        }

        password = this.bcrypt.hashSync(payload.password, this.bcrypt.genSaltSync(10))
        const data = {
            name,
            username,
            password,
            telp,
            accessRole: 'Petugas',
            createdAt: new Date(Date.now())
        }
        const result: any = await this.command.insertOne(data)
        if (result.err) {
            return this.wrapper.error(result)
        }
        return this.wrapper.data(data)
    }

    async deletePetugas(payload: { id: string, accessRole: string}){
        if (payload.accessRole !== 'Admin') {
            return this.wrapper.error(`This Role Can't Access this Service`)
        }
        const checkUser: any = await this.query.findById(payload.id)
        if (checkUser.err) {
            return this.wrapper.error('User Not Found')
        }
        const result: any = await this.command.deleteOne(payload.id)
        if (result.err) {
            return this.wrapper.error('fail delete user')
        }
        return this.wrapper.data(result.data)
    }

    async updateOne(payload: { id: string, name: string, username: string, password: string, telp: string, accessRole: string}){
        let { id, name, username, password, telp } = payload
        if (payload.accessRole !== 'Admin') {
            return this.wrapper.error(`This Role Can't Access this Service`)
        }
        const checkUser: any = await this.query.findById(id)
        if (checkUser.err) {
            return this.wrapper.error('User Not Found')
        }
        const data = {
            name,
            username: username.toLowerCase(),
            password: checkUser.data.password,
            telp,
            updatedAt: new Date(Date.now())
        }
        if (password) {
            const compare = this.bcrypt.compareSync(password, checkUser.data.password)
            if (compare === false) {
                data.password = this.bcrypt.hashSync(payload.password, this.bcrypt.genSaltSync(10))
            }
        }
        const result: any = await this.command.updateOne(id, {$set:{...data}})
        if (result.err) {
            return this.wrapper.error('Fail Update Data')
        }
        return this.wrapper.data(result.data)
    }
}