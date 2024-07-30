"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.JWTAdapter = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const envs_1 = require("./envs");
const JWTSECRET = envs_1.envs.JWT_SECRET;
class JWTAdapter {
    static createToken(payload_1) {
        return __awaiter(this, arguments, void 0, function* (payload, duration = "2h") {
            return new Promise((resolve, reject) => {
                jwt.sign(payload, JWTSECRET, { expiresIn: duration }, (err, token) => {
                    if (err) {
                        resolve(null);
                    }
                    else {
                        resolve(token);
                    }
                });
            });
        });
    }
    static validateToken(token) {
        {
            return new Promise((resolve, reject) => {
                jwt.verify(token, JWTSECRET, (err, decoded) => {
                    if (err) {
                        resolve(null);
                    }
                    else {
                        resolve(decoded);
                    }
                });
            });
        }
    }
}
exports.JWTAdapter = JWTAdapter;
