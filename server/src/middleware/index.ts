import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import logger from '../library/logger';
import { getErrorMessage } from '../utils/errors';

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    next();
};

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
    logger.error(error);
    error.statusCode = error.statusCode || 500;
    error.type = error.type || 'server_error';
    res.status(error.statusCode).json({
        status: false,
        message: getErrorMessage(error.type)
    });
};

export const promiseHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        });
        return next();
    } catch (error: ZodError | any) {
        return res.status(400).json({
            status: false,
            message: error.issues
        });
    }
};
