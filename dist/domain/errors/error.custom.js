"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(status, mensaje) {
        super(mensaje);
        this.status = status;
        this.mensaje = mensaje;
    }
    static badRequest(mensaje) {
        throw new CustomError(400, mensaje);
    }
    static unAuthorized(mensaje) {
        throw new CustomError(401, mensaje);
    }
    static forbidden(mensaje) {
        throw new CustomError(401, mensaje);
    }
    static notFound(mensaje) {
        throw new CustomError(404, mensaje);
    }
    static internalServerError(mensaje) {
        throw new CustomError(500, mensaje);
    }
}
exports.CustomError = CustomError;
