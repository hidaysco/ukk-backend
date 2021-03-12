import { Wrapper } from '../../../utils/helpers/wrapper';
import { Command } from './command';
import { Query } from '../queries/query';
import bcryptjs from "bcryptjs";

export default interface ICommandWorker{
    registerAdmin(payload: { name: string, username: string, password: string }): object
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
    
    async registerAdmin(payload: { name: string; username: string; password: string; }) {
        const { name, username, password } = payload
        const checkUser: any = await this.query.findOne({ accessRole: 'Admin' })
        if (checkUser.data) {
            return this.wrapper.error('Admin Already Registered')
        }
        const data = {
            name,
            username,
            password,
            accessRole: 'Admin'
        }
        data.password = this.bcrypt.hashSync(payload.password, this.bcrypt.genSaltSync(10))
        const result: any = this.command.insertOne(data)
        if (result.err) {
            this.wrapper.error('Failed Insert Data')
        }
        return this.wrapper.data(data)
    }
}