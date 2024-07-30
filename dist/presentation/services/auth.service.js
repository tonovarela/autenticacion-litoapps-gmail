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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jwt_adapter_1 = require("../../config/jwt.adapter");
const client_1 = require("@prisma/client");
const error_custom_1 = require("../../domain/errors/error.custom");
const prisma = new client_1.PrismaClient();
class AuthService {
    constructor() {
        this.login = (loginUserDTO) => __awaiter(this, void 0, void 0, function* () {
            const { login, password } = loginUserDTO;
            const userLitoDB = yield prisma.cat_Usuarios.findFirst({ where: { Login: login, Password: password } });
            if (userLitoDB && userLitoDB.estatus == 'INACTIVO') {
                throw error_custom_1.CustomError.unAuthorized('User disabled');
            }
            if (!userLitoDB)
                throw error_custom_1.CustomError.unAuthorized('Invalid credentials');
            const { Id_Usuario } = userLitoDB;
            const token = yield jwt_adapter_1.JWTAdapter.createToken({ id: Id_Usuario });
            if (!token) {
                throw error_custom_1.CustomError.internalServerError('Error creating token');
            }
            return { id: Id_Usuario, token };
        });
    }
}
exports.AuthService = AuthService;
