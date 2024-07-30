"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserDTO = void 0;
class LoginUserDTO {
    constructor(login, password) {
        this.login = login;
        this.password = password;
    }
    static create(object) {
        const { login, password } = object;
        if (!login)
            return ["Falta el login"];
        if (!password)
            return ["Falta la contraseña"];
        return [undefined, new LoginUserDTO(login, password)];
    }
}
exports.LoginUserDTO = LoginUserDTO;
