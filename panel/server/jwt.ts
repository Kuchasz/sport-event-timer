import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';

export const sign = promisify<string | object | Buffer, jwt.Secret, jwt.SignOptions, string>(jwt.sign);
export const verify = promisify<string, jwt.Secret, any>(jwt.verify);
export const decode = jwt.decode;
