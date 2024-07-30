"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const login_user_dto_1 = require("../../domain/dtos/auth/login.user.dto");
const controlller_abstract_1 = require("../abstract/controlller.abstract");
class AuthController extends controlller_abstract_1.AbstractController {
    constructor(authService) {
        super();
        this.authService = authService;
        this.checkToken = (req, res) => {
            try {
                if (!req.body.usuario)
                    return res.status(401).json({ "error": "Usuario No valido" });
                return res.json({ "usuario": req.body.usuario, "token": req.body.token });
            }
            catch (e) {
                return res.status(500).json({ "error": "Error Server" });
            }
        };
        this.login = (req, res) => {
            const [error, loginUserDTO] = login_user_dto_1.LoginUserDTO.create(req.body);
            if (error)
                return res.status(400).json({ error });
            this.authService.login(loginUserDTO).then((response) => {
                return res.json(response);
            }).catch(error => this.handleError(error, res));
        };
    }
}
exports.AuthController = AuthController;
