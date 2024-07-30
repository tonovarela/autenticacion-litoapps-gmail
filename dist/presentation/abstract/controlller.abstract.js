"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractController = void 0;
const error_custom_1 = require("../../domain/errors/error.custom");
class AbstractController {
    constructor() {
        this.handleError = (error, res) => {
            if (error instanceof error_custom_1.CustomError)
                return res.status(error.status).json({ error: error.mensaje });
            return res.status(500).json({ "error": "Internal server error" });
        };
    }
}
exports.AbstractController = AbstractController;
