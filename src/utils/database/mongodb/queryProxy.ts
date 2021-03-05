import { MongoConnection } from './connection'
import { Wrapper } from "../../helpers/wrapper";
require('dotenv').config();

export default interface IQueryProxy{
    setCollection(collectionName: any):any
    getDatabase():any
    insertOne(document: any): any
    updateOne(id: string, param: any): any
    deleteOne(id: string): any
    findOne(param: any): any
    find(param?: any): any
    aggregate(params?: any):any
}

export class QueryProxy implements IQueryProxy {
    wrapper: Wrapper
    collectionName: any;
    connection: MongoConnection;
    URL: string
    constructor() { 
        this.wrapper = new Wrapper()
        this.connection = new MongoConnection()
        this.URL = process.env.mongoURL || 'mongodb://localhost:27017/learn'
    }

    setCollection(collectionName: any) {
        this.collectionName = collectionName;
    }

    getDatabase(){
        const config = this.URL.replace('//', '');
        const pattern = new RegExp('/([a-zA-Z0-9-]+)?');
        const dbName: any = pattern.exec(config);
        return dbName[1];
    }

    async insertOne(document: any) {
        const dbName = await this.getDatabase()
        const checkConn:any = await this.connection.checkConnection()
        try {
            const connection = checkConn.db(dbName)
            const db = connection.collection(this.collectionName)
            const recordset = await db.insertOne(document)
            if (recordset.result.n!==1) {
                return this.wrapper.error('Fail Insert Data')
            }
            return this.wrapper.data(document)
        } catch (err) {
            return this.wrapper.error(`Error Create One Mongo ${err.message}`)
        }
    }

    async updateOne(parameter: any, data: any) {
        const dbName = await this.getDatabase()
        const checkConn:any = await this.connection.checkConnection()
        try {
            const connection = checkConn.db(dbName)
            const db = connection.collection(this.collectionName)
            const recordset = await db.updateOne(parameter, data);
            if (recordset.result.nModified > 0) {
                const recordset = await this.findOne(parameter);
                return this.wrapper.data(recordset.data);
            }
            return this.wrapper.error('Failed upsert data');
        } catch (err) {
            return this.wrapper.error(`Error Update One Mongo ${err.message}`)
        }
    }

    async deleteOne(id: any) {
        const dbName = await this.getDatabase()
        const checkConn:any = await this.connection.checkConnection()
        try {
            const connection = checkConn.db(dbName)
            const db = connection.collection(this.collectionName)
            const recordset = await db.deleteOne(id)
            return this.wrapper.data(recordset.data)
        } catch (err) {
            return this.wrapper.error(`Error Delete One Mongo ${err.message}`)
        }
    }

    async findOne(param: any) {
        const dbName = await this.getDatabase()
        const checkConn:any = await this.connection.checkConnection()
        try {
            const connection = checkConn.db(dbName)
            const db = connection.collection(this.collectionName)
            const recordset = await db.findOne(param)
            if (recordset===null) {
                return this.wrapper.error('User Not Found')
            }
            return this.wrapper.data(recordset)
        } catch (err) {
            return this.wrapper.error(`Error Find One Mongo ${err.message}`)
        }
    }

    async find(param?: any) {
        const dbName = await this.getDatabase()
        const checkConn:any = await this.connection.checkConnection()
        try {
            const connection = checkConn.db(dbName)
            const db = connection.collection(this.collectionName)
            const recordset = await db.findOne(param||{})
            return this.wrapper.data(recordset)
        } catch (err) {
            return this.wrapper.error(`Error Find Mongo ${err.message}`)
        }
    }

    async aggregate(param:any) {
        const dbName = await this.getDatabase()
        const checkConn:any = await this.connection.checkConnection()
        try {
            const connection = checkConn.db(dbName);
            const db = connection.collection(this.collectionName);
            const recordset = await db.aggregate(param).toArray();
            if (recordset===[]) {
              return this.wrapper.error('Data Not Found');
            }
            return this.wrapper.data(recordset);
          } catch (err) {
            return this.wrapper.error(`Error Find One Mongo ${err.message}`);
          }
    }

    async count(param:any) {
        const dbName = await this.getDatabase()
        const checkConn:any = await this.connection.checkConnection()
        try {
            const connection = checkConn.db(dbName);
            const db = connection.collection(this.collectionName);
            const recordset = await db.count(param)
            return this.wrapper.data(recordset);
          } catch (err) {
            return this.wrapper.error(`Error Find One Mongo ${err.message}`);
          }
    }
}