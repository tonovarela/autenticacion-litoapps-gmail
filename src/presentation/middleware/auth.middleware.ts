import { NextFunction, Request, Response } from "express";
import { JWTAdapter } from "../../config/jwt.adapter";
import { getAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';
import { PrismaClient } from "@prisma/client";
import { envs } from '../../config/envs';

const defaultApp = initializeApp({
    projectId: envs.FIREBASE_PROJECT_ID
});
const prisma = new PrismaClient();
export class AuthMiddleware {
    
    static async validateJWT(req: Request, res: Response, next: NextFunction) {
        try {
            const autorization = req.header("Authorization");
            if (!autorization) return res.status(401).json({ error: 'No token provided' });
            if (!autorization.startsWith("Bearer ")) return res.status(401).json({ error: "No token provided" });
            const token = autorization.split(" ").at(1) || "";
            const payload = await JWTAdapter.validateToken<{ id: string }>(token);            
            if (!payload || payload.id?.length == 0) {                
                next();
                return
            }            
            const id = payload.id;            
            const externalUserDB = await prisma.externalUser.findUnique({ where: { id:id.toString() } });            
            if (externalUserDB && externalUserDB.estatus == false) {                
                return res.status(401).json({ error: 'User disabled' });
            }            
            const newToken = await JWTAdapter.createToken({ id }, '30 days');
            req.body.token = newToken            
            if (externalUserDB) {
                const { register, estatus, ...rest } = externalUserDB!
                req.body.usuario = { ...rest };
                next();
                return
            }            
            const userLito = await prisma.cat_Usuarios.findUnique({ where: { Id_Usuario: +id } });
            if (!userLito) return res.status(401).json({ error: 'User not found' });
            if (userLito.estatus == 'INACTIVO') {
                return res.status(401).json({ error: 'User disabled' });
            }
            const { Id_Usuario, Nombre, Correo, Personal, Login } = userLito
            req.body.usuario = {
                id: Id_Usuario,
                name: Nombre,
                username: Login,
                email: Correo,
                photoUrl: `https://servicios.litoprocess.com/colaboradores/api/foto/${Personal || 'XX'}`
            };
            next();
        } catch (e) {
            next();
        }

    }

    static async validateFireBaseToken(req: Request, res: Response, next: NextFunction) {

        if (req.body.usuario != undefined)
            return next();
        try {
            const autorization = req.header("Authorization");
            if (!autorization) return res.status(401).json({ error: 'No token provided' });
            if (!autorization.startsWith("Bearer ")) return res.status(401).json({ error: "No token provided" });
            const token = autorization.split(" ").at(1) || "";
            const response = await getAuth(defaultApp)
                .verifyIdToken(token);
            const { uid: id, name, email, picture: photoURL } = response
            const externalDBUser = await prisma.externalUser.findUnique({ where: { id: response.uid } });
            if (externalDBUser && externalDBUser.estatus == false) {
                return res.status(401).json({ error: 'User disabled' });
            }
            const user = {
                id,
                name,
                username: email?.split('@')[0],
                email,
                photoURL
            };
            if (!externalDBUser) {
                await prisma.externalUser.create({
                    data: {
                        ...user,
                        register: new Date(),
                        estatus: true
                    }
                });

            };
            req.body.usuario = { ...user };
            const newToken = await JWTAdapter.createToken({ id }, '30 days');
            req.body.token = newToken;
            next();
        }
        catch (e) {
            console.log(e);
            req.body.usuario = null;
            next();
        }

    }

}