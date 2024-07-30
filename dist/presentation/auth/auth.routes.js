"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_service_1 = require("../services/auth.service");
class AuthRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const authService = new auth_service_1.AuthService();
        const controller = new controller_1.AuthController(authService);
        router.get('/checkToken', [auth_middleware_1.AuthMiddleware.validateJWT,
            auth_middleware_1.AuthMiddleware.validateFireBaseToken
        ], controller.checkToken);
        router.post('/login', controller.login);
        return router;
    }
}
exports.AuthRoutes = AuthRoutes;
