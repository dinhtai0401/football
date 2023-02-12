"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = void 0;
const errors = {
    server_error: {
        message: 'Internal server error'
    },
    database_error: {
        message: 'Database error'
    },
    duplicated_value: {
        message: 'Duplicated value'
    },
    invalid_request: {
        message: 'Invalid request'
    }
};
const getErrorMessage = (error) => {
    if (error in errors) {
        return errors[error].message;
    }
    return 'General error';
};
exports.getErrorMessage = getErrorMessage;
