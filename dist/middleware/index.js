"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.promiseHandler = exports.errorHandler = exports.logRequest = void 0;
const logger_1 = __importDefault(require("../library/logger"));
const errors_1 = require("../utils/errors");
const logRequest = (req, res, next) => {
    logger_1.default.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    next();
};
exports.logRequest = logRequest;
const errorHandler = (error, req, res, next) => {
    logger_1.default.error(error);
    error.statusCode = error.statusCode || 500;
    error.type = error.type || 'server_error';
    res.status(error.statusCode).json({
        status: false,
        message: (0, errors_1.getErrorMessage)(error.type)
    });
};
exports.errorHandler = errorHandler;
const promiseHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.promiseHandler = promiseHandler;
const validate = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        });
        return next();
    }
    catch (error) {
        return res.status(400).json({
            status: false,
            message: error.issues
        });
    }
});
exports.validate = validate;
