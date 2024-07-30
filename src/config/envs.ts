import 'dotenv/config';
import { get } from 'env-var';


export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    JWT_SECRET: get('JWT_SECRET').required().asString(),
    PRODUCTION : get("PRODUCTION").default("false").asBool(), 
    FIREBASE_PROJECT_ID: get('FIREBASE_PROJECT_ID').required().asString(),

}