"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./library/logger"));
const middleware_1 = require("./middleware");
const mongo_1 = __importDefault(require("./database/mongo"));
const v1_1 = __importDefault(require("./routes/v1"));
const router = (0, express_1.default)();
router.use(express_1.default.urlencoded({ extended: true }));
router.use(express_1.default.json());
/** Database connection */
(0, mongo_1.default)();
router.use(v1_1.default);
/** Middlewares */
router.use(middleware_1.logRequest);
router.use(middleware_1.errorHandler);
if (config_1.default.env === 'production') {
    router.use(express_1.default.static(path_1.default.resolve(__dirname, '../client/build')));
    router.get('*', (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, '../client/build/index.html'));
    });
}
http_1.default.createServer(router).listen(config_1.default.port, () => logger_1.default.info(`Server is running on port ${config_1.default.port}`));
