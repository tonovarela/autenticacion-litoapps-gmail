import { Router } from "express";
import { AuthController } from "./controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { AuthService } from "../services/auth.service";
export class AuthRoutes {

    static get routes(): Router {
        const router = Router();        
        const authService = new AuthService();
        const controller = new AuthController(authService);
        router.get('/checkToken', 
            [AuthMiddleware.validateJWT,
            AuthMiddleware.validateFireBaseToken
        ],controller.checkToken);
        router.post('/login', controller.login);
        return router;
    }

}