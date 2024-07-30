
import { Request, Response } from 'express'
import { LoginUserDTO } from '../../domain/dtos/auth/login.user.dto';
import { AuthService } from '../services/auth.service';
import { AbstractController } from '../abstract/controlller.abstract';

export class AuthController extends AbstractController {
    constructor(private readonly authService: AuthService) {
        super();
    }
    checkToken = (req: Request, res: Response) => {
        try {
            if (!req.body.usuario) return res.status(401).json({ "error": "Usuario No valido" });
            return res.json({ "usuario": req.body.usuario, "token": req.body.token });
        }
        catch (e) {
            return res.status(500).json({ "error": "Error Server" });
        }
    }

    login = (req: Request, res: Response) => {
        const [error, loginUserDTO] = LoginUserDTO.create(req.body);
        if (error) return res.status(400).json({ error });
        this.authService.login(loginUserDTO!).then((response) => {
            return res.json(response);
        }).catch(error => this.handleError(error, res));

    }

}