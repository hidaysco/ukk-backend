import { Wrapper } from '../../../utils/helpers/wrapper';
import { Command } from './command';
import { Query } from '../queries/query';
import { generate } from "../../../utils/auth/jwtAuth";
import { expiredToken } from "../utils/constans";
import bcryptjs from "bcryptjs";
export default interface ICommandWorker{
    registerUser(payload: { name:string, username: string, nik: number, password: string }): any
    deleteUser(payload: string): any
    updateOne(payload: { id: string, name:string, username: string, password: string }): any
    loginUser(payload: { username: string, password: string }): any
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

    async registerUser(payload: { name:string, username: string, nik: number, password: string }) {
        let { nik, name, username, password }= payload
        const checkNIK: any = await this.query.findOneUser({nik})
        if (checkNIK.data) {
            return this.wrapper.error('NIK Already Registered')
        }
        const checkUser: any = await this.query.findOneUser({username})
        if (checkUser.data) {
            return this.wrapper.error('Username Already Registered')
        }
        password = this.bcrypt.hashSync(payload.password, this.bcrypt.genSaltSync(10))
        const data = {
            nik,
            name,
            username,
            password,
            accessRole: 'User',
            createdAt: new Date(Date.now())
        }
        const result: any = await this.command.insertOne(data)
        if (result.err) {
            return this.wrapper.error(result)
        }
        return this.wrapper.data(data)
    }

    async deleteUser(payload: string){
        const checkUser: any = await this.query.findById(payload)
        if (checkUser.err) {
            return this.wrapper.error('User Not Found')
        }
        const result: any = await this.command.deleteOne(payload)
        if (result.err) {
            return this.wrapper.error('fail delete user')
        }
        return this.wrapper.data(result.data)
    }

    async updateOne(payload: { id: string, name:string, username: string, password: string }){
        let { id, name, username, password } = payload
        const checkUser: any = await this.query.findById(id)
        if (checkUser.err) {
            return this.wrapper.error('User Not Found')
        }
        const checkUsername: any = await this.query.findOneUser({username: username.toLowerCase()})
        if (checkUsername.data && checkUser.data.username !== username) {
            return this.wrapper.error('Username Already Registered')
        }
        const data = {
            name,
            username: username.toLowerCase(),
            password: checkUser.data.password,
            updatedAt: new Date(Date.now())
        }
        const compare = this.bcrypt.compareSync(password, checkUser.data.password)
        if (compare === false) {
            data.password = this.bcrypt.hashSync(payload.password, this.bcrypt.genSaltSync(10))
        }
        const result: any = await this.command.updateOne(id, {$set:{...data}})
        if (result.err) {
            return this.wrapper.error('Fail Update Data')
        }
        return this.wrapper.data(result.data)
    }

    async loginUser(payload: { username: string, password: string }) {
        const { username, password } =payload
        const result: any = await this.query.findOneUser({username})
        if (result.err) {
            return this.wrapper.error('User Not Found')
        }
        const data = result.data
        const compare = this.bcrypt.compareSync(password, data.password)
        if (compare==false) {
            return this.wrapper.error("Username And Password Not Match")
        }
        const accessToken= await generate(data, expiredToken.accessToken)
        const token = {
            name: data.name,
            username: data.username,
            accessToken,
            accessRole: data.accessRole,
            expired: expiredToken.accessToken
        }
        return this.wrapper.data(token)
    }
}