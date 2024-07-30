

export class LoginUserDTO {

    private constructor(
        readonly login: string,
        readonly password: string
    ) {
    }
    static create(object: { [key: string]: any }): [string?, LoginUserDTO?] {
        const {login, password } = object;
        if (!login) return ["Falta el login"];
        if (!password) return ["Falta la contraseña"];                
        return [undefined, new LoginUserDTO(login, password)];
    }

}