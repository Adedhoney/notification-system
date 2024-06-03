// import { BaseError } from '@application/Error/Error';
// import { ResponseDTO, ResponseStatus } from '@application/Response/Response';
import { NextFunction, Request, Response } from 'express';

export abstract class BaseError extends Error {
    abstract status: number;

    constructor(public message: string = 'Something went wrong') {
        super(message);
    }
}

export class NotFoundError extends BaseError {
    status = 404;
    message: string;

    constructor(message: string = 'Not Found') {
        super(message);
        this.message = message;
        this.status = 404;
    }
}

export class CustomError extends BaseError {
    status: number;
    message: string;

    constructor(message: string, status: number = 200) {
        super(message);
        this.message = message;
        this.status = status;
    }
}

export const ErrorHandler = (
    error: Error | BaseError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    console.log('[ERROR]', { error });

    let status = 500;
    let message = 'Something went wrong';

    if (error instanceof BaseError) {
        status = error.status;
        message = error.message;
    }

    res.status(status).send({ status, message });
    return next();
};
