"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const teamErrorHandler = (error, req, res, next) => {
    if (error) {
        error.statusCode = 400;
        error.type = 'duplicated_value';
    }
    next(error);
};
exports.default = teamErrorHandler;
