import jwt from 'jsonwebtoken'
import { Wrapper } from '../helpers/wrapper';
import {Request,Response,NextFunction} from 'express'
require('dotenv').config()

export const generate = async (payload: any,secondExpired: any)=>{
    const privateKey: string = process.env.secret_key || "hidays"
    const verifyOptions:any = {
        algorithm: 'HS256',
        expiresIn: secondExpired ? secondExpired : '1000m'
    };
    const token = jwt.sign(payload, privateKey, verifyOptions);
    return token;
}

export const auth =  (req:Request,res:Response,next:NextFunction): any=>{
    const wrapper = new Wrapper()
    const headers = req.headers.authorization as string
    if (!headers) {
        return wrapper.response(res, 'fail', {err: 'fail'}, "Auth Required", 511)
    }
    const token:string = headers.split(' ')[1]
    const privateKey: string = process.env.secret_key || "hidays"
    try{
        const decoded:any = jwt.verify(token, privateKey)
        if (!decoded) {
            return wrapper.response(res, 'fail', {err: 'fail'}, "Token Invalid", 403)
        }
        req.user = decoded
        next()
    }catch(err){
        return wrapper.response(res, 'fail', {err: 'fail'}, "Access token expired!", 401)
    }
}