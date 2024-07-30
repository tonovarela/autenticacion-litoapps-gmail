"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jwt_adapter_1 = require("../../config/jwt.adapter");
const auth_1 = require("firebase-admin/auth");
const app_1 = require("firebase-admin/app");
const client_1 = require("@prisma/client");
const envs_1 = require("../../config/envs");
const defaultApp = (0, app_1.initializeApp)({
    projectId: envs_1.envs.FIREBASE_PROJECT_ID
});
const prisma = new client_1.PrismaClient();
class AuthMiddleware {
    static validateJWT(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const autorization = req.header("Authorization");
                if (!autorization)
                    return res.status(401).json({ error: 'No token provided' });
                if (!autorization.startsWith("Bearer "))
                    return res.status(401).json({ error: "No token provided" });
                const token = autorization.split(" ").at(1) || "";
                const payload = yield jwt_adapter_1.JWTAdapter.validateToken(token);
                if (!payload || ((_a = payload.id) === null || _a === void 0 ? void 0 : _a.length) == 0) {
                    next();
                    return;
                }
                const id = payload.id;
                const externalUserDB = yield prisma.externalUser.findUnique({ where: { id: id.toString() } });
                if (externalUserDB && externalUserDB.estatus == false) {
                    return res.status(401).json({ error: 'User disabled' });
                }
                const newToken = yield jwt_adapter_1.JWTAdapter.createToken({ id }, '30 days');
                req.body.token = newToken;
                if (externalUserDB) {
                    const _b = externalUserDB, { register, estatus } = _b, rest = __rest(_b, ["register", "estatus"]);
                    req.body.usuario = Object.assign({}, rest);
                    next();
                    return;
                }
                const userLito = yield prisma.cat_Usuarios.findUnique({ where: { Id_Usuario: +id } });
                if (!userLito)
                    return res.status(401).json({ error: 'User not found' });
                if (userLito.estatus == 'INACTIVO') {
                    return res.status(401).json({ error: 'User disabled' });
                }
                const { Id_Usuario, Nombre, Correo, Personal, Login } = userLito;
                req.body.usuario = {
                    id: Id_Usuario,
                    name: Nombre,
                    username: Login,
                    email: Correo,
                    photoUrl: `https://servicios.litoprocess.com/colaboradores/api/foto/${Personal || 'XX'}`
                };
                next();
            }
            catch (e) {
                next();
            }
        });
    }
    static validateFireBaseToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.usuario != undefined)
                return next();
            try {
                const autorization = req.header("Authorization");
                if (!autorization)
                    return res.status(401).json({ error: 'No token provided' });
                if (!autorization.startsWith("Bearer "))
                    return res.status(401).json({ error: "No token provided" });
                const token = autorization.split(" ").at(1) || "";
                const response = yield (0, auth_1.getAuth)(defaultApp)
                    .verifyIdToken(token);
                const { uid: id, name, email, picture: photoURL } = response;
                const externalDBUser = yield prisma.externalUser.findUnique({ where: { id: response.uid } });
                if (externalDBUser && externalDBUser.estatus == false) {
                    return res.status(401).json({ error: 'User disabled' });
                }
                const user = {
                    id,
                    name,
                    username: email === null || email === void 0 ? void 0 : email.split('@')[0],
                    email,
                    photoURL
                };
                if (!externalDBUser) {
                    yield prisma.externalUser.create({
                        data: Object.assign(Object.assign({}, user), { register: new Date(), estatus: true })
                    });
                }
                ;
                req.body.usuario = Object.assign({}, user);
                const newToken = yield jwt_adapter_1.JWTAdapter.createToken({ id }, '30 days');
                req.body.token = newToken;
                next();
            }
            catch (e) {
                console.log(e);
                req.body.usuario = null;
                next();
            }
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
