import {MySQL} from './connection';
import { Wrapper } from '../../helpers/wrapper';

export default interface IQueryProxy{
    query(quey: any, param?: any):any
}

export class QueryProxy implements IQueryProxy {
    pool: MySQL
    wrapper: Wrapper
    constructor() {
        this.pool = new MySQL()
        this.wrapper = new Wrapper()
    }
    async query(query: any, param?: any) {
        const db = this.pool.createConnection()
        const recordset = () => {
            return new Promise((resolve, reject) => {
              db.getConnection((err, connection) => {
                if (err) {
                  let errorMessage;
                  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    errorMessage = 'Database connection was closed.';
                  }
                  if (err.code === 'ER_CON_COUNT_ERROR') {
                    errorMessage = 'Database has too many connections.';
                  }
                  if (err.code === 'ECONNREFUSED') {
                    errorMessage = 'Database connection was refused.';
                  }
                  connection.release();
                  reject(this.wrapper.error(errorMessage));
                }
                else {
                  connection.query(query, param, (err, result) => {
                    if (err) {
                      connection.release();
                      reject(this.wrapper.error(err.message));
                    }
                    else {
                      connection.release();
                      resolve(this.wrapper.data(result));
                    }
                  });
                }
              });
            });
          };
          const result = await recordset().then(result => {
            return result;
          }).catch(err => {
            return err;
          });
          return result;

    }
}