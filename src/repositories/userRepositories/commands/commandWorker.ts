import { Wrapper } from '../../../utils/helpers/wrapper';
import { Command } from './command';
import { Query } from '../queries/query';
import { generate } from "../../../utils/auth/jwtAuth";
import { expiredToken } from "../utils/constans";
import bcryptjs from "bcryptjs";

export default interface ICommandWorker{
    registerUser(payload: any): any
    loginUser(payload: any): any
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

    async registerUser(payload: any) {
        payload.password = this.bcrypt.hashSync(payload.password, this.bcrypt.genSaltSync(10))
        const result: any = await this.command.insertOne(payload)
        if (result.err) {
            return this.wrapper.error(result)
        }
        return this.wrapper.data(payload)
    }

    async loginUser(payload: any) {
        const { username, password } =payload
        const result: any = await this.query.getOneUserByUsername(username)
        if (result.err) {
            return this.wrapper.error(result)
        }
        const data = result.data[0]
        payload = {
            id_user: data.id_user,
            name: data.name,
            username: data.username,
            telp: data.telp
        }
        const compare = this.bcrypt.compareSync(password, result.data[0].password)
        if (compare==false) {
            return this.wrapper.error("Username And Password Not Match")
        }
        const accessToken= await generate(payload, expiredToken.accessToken)
        const token = {
            name: data.name,
            username: data.username,
            accessToken,
            expired: expiredToken.accessToken
        }
        return this.wrapper.data(token)
    }
}