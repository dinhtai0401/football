import express, { Response, Request } from 'express';
import http from 'http';
import path from 'path'
import config from './config';
import logger from './library/logger';
import { logRequest, errorHandler } from './middleware';
import mongoConn from './database/mongo';
import v1 from './routes/v1';

const router = express();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/** Database connection */
mongoConn();

router.use(v1);

/** Middlewares */
router.use(logRequest);
router.use(errorHandler);

if (config.env === 'production') {
    router.use(express.static(path.resolve(__dirname, '../client/build')))

    router.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, '../client/build/index.html'))
    })
}

http.createServer(router).listen(config.port, () => logger.info(`Server is running on port ${config.port}`));
