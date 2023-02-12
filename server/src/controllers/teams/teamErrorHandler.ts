import { Request, Response, NextFunction } from 'express';

const teamErrorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
    if (error) {
        error.statusCode = 400;
        error.type = 'duplicated_value';
    }

    next(error);
};

export default teamErrorHandler;
