import * as jwt from 'jsonwebtoken';
import { envs } from './envs';
const JWTSECRET = envs.JWT_SECRET;


export class JWTAdapter {


    static async createToken(payload: any, duration = "2h") {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, JWTSECRET, { expiresIn: duration }, (err, token) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(token);
                }
            });
        });
    }

    static validateToken<T>(token: string): Promise<T | null> {
        {
            return new Promise((resolve, reject) => {
                jwt.verify(token, JWTSECRET, (err, decoded) => {
                    if (err) {
                        resolve(null);
                    } else {
                        resolve(decoded as T);
                    }
                });

            });
        }
    }

}