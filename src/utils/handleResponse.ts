import { Response } from 'express';

// Helper function to handle responses
const handleResponse = (
    res: Response,
    statusCode: number,
    status: string,
    message: string,
    data: any = null
) => {
    res.status(statusCode).json({
        status,
        message,
        ...(data && { data }),
    });
};

export default handleResponse;
