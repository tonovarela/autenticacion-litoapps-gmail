import { LoginUserDTO } from "../../domain/dtos/auth/login.user.dto";
import { JWTAdapter } from "../../config/jwt.adapter";
import { PrismaClient } from "@prisma/client";
import { CustomError } from "../../domain/errors/error.custom";
const prisma = new PrismaClient();        
export class AuthService {
    constructor() {

    }
    
    login = async (loginUserDTO: LoginUserDTO) => {               
         const {login,password}= loginUserDTO;
          const userLitoDB = await prisma.cat_Usuarios.findFirst({ where: {Login:login,Password:password} });
         if (userLitoDB && userLitoDB.estatus == 'INACTIVO') {
                throw CustomError.unAuthorized('Usuario deshabilitado');
         }
         if (!userLitoDB) throw CustomError.unAuthorized('Credenciales incorrectas');
        const { Id_Usuario } = userLitoDB;
        const token = await JWTAdapter.createToken({ id: Id_Usuario });
        if (!token) {
            throw CustomError.internalServerError('Error al generar token');
        }
        return { token };        
}

}