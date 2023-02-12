"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const logger_1 = __importDefault(require("../library/logger"));
const mongoConn = () => {
    mongoose_1.default.set('strictQuery', true);
    mongoose_1.default
        .connect(config_1.default.databaseURL, { retryWrites: true, w: 'majority' })
        .then(() => {
        logger_1.default.info('Connected to MongoDB.');
    })
        .catch((error) => {
        logger_1.default.error('Unable to connect to MongoDB');
        logger_1.default.error(error);
        process.exit();
    });
};
exports.default = mongoConn;
