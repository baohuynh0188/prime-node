import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import expressWinston from 'express-winston';

import feedRouter from './routers/feed-router';
import todoRouter from './routers/todo-router';
import logger from './utils/logger';
import handleResponse from './utils/handleResponse';
import httpStatusCode from './constants/httpStatusCodes';

// Create an Express application
const app = express();

const apiVersion = 1;
const rootApi = `/api/v${apiVersion}`;

app.use(bodyParser.json());

app.use((req: Request, res: Response, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});

// Apply the logger middleware
app.use(
    expressWinston.logger({
        winstonInstance: logger,
        meta: true,
        msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        expressFormat: true,
        colorize: true,
    })
);

// app.use(`${rootApi}/feed`, feedRouter);
app.use(`${rootApi}/todos`, todoRouter);

// Handle undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
    handleResponse(res, httpStatusCode.NOT_FOUND, 'Error', 'Route not found');
});

// Error logging middleware
// example: 2024-11-03T06:03:07.089Z [error]: middlewareError
app.use(
    expressWinston.errorLogger({
        winstonInstance: logger,
    })
);

// Error handling middleware
// example: 2024-11-03T06:02:51.506Z [error]: Unexpected end of JSON input
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, { stack: err.stack });
    handleResponse(
        res,
        err.status || httpStatusCode.INTERNAL_SERVER_ERROR,
        'Error',
        err.message
    );
});

export default app;
