import { Request, Response } from 'express';
import {
    DynamoDBDocumentClient,
    DeleteCommand,
    GetCommand,
    PutCommand,
    ScanCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

import { Todo } from '../models/todo';
import handleResponse from '../utils/handleResponse';
import dynamodbClient from '../configs/dynamodbClient';
import httpStatusCode from '../constants/httpStatusCodes';
import logger from '../utils/logger';
import Joi from 'joi';

const docClient = DynamoDBDocumentClient.from(dynamodbClient);
const TABLE_NAME = 'todos';

// Define the schema for validation
const todoSchema = Joi.object({
    title: Joi.string().max(255).required(),
    description: Joi.string().max(1024).required(),
    cardColor: Joi.string().max(7).optional(),
    isCompleted: Joi.boolean().optional(),
});

// List all to-do items
export const listTodos = async (req: Request, res: Response) => {
    const command = new ScanCommand({
        TableName: TABLE_NAME,
    });

    try {
        const response = await docClient.send(command);
        logger.info('List all to-do items', { response });
        handleResponse(
            res,
            httpStatusCode.OK,
            'Success',
            'List all to-do items',
            response
        );
    } catch (error) {
        handleResponse(
            res,
            httpStatusCode.INTERNAL_SERVER_ERROR,
            'Error',
            'Error in DB Operation!',
            error
        );
    }
};

// Get a to-do item by ID
export const getTodo = async (req: Request, res: Response) => {
    const id: string = req.body.id;

    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
    });

    try {
        const response = await docClient.send(command);
        console.log('get one response ', response);
        if (!response) {
            handleResponse(
                res,
                httpStatusCode.NOT_FOUND,
                'Success',
                `No Todo found with ID: ${id}`,
                response
            );
        }
        handleResponse(
            res,
            httpStatusCode.OK,
            'Success',
            `Get to-do item by ID: ${id}`,
            response
        );
    } catch (error) {
        handleResponse(
            res,
            httpStatusCode.INTERNAL_SERVER_ERROR,
            'Error',
            'Error in DB Operation!',
            error
        );
    }
};

// Create a to-do item
export const createTodo = async (req: Request, res: Response) => {
    // Validate the request body
    const { error } = todoSchema.validate(req.body);
    if (error) {
        logger.error('Validation error', { error: error.details });
        return handleResponse(
            res,
            httpStatusCode.BAD_REQUEST,
            'Error',
            'Validation error',
            error.details
        );
    }

    const { title, description } = req.body;

    const newTodo: Todo = {
        id: uuidv4(),
        title,
        description,
        cardColor: '#cddc39',
        isCompleted: false,
        timestamps: {
            createdOn: new Date().toISOString(),
            modifiedOn: null,
            completedOn: null,
        },
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: newTodo,
    });

    try {
        await docClient.send(command);
        res.status(201).json({
            status: 'Success',
            message: 'Todo has been created successfully!',
            todo: newTodo,
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Error in DB Operation!',
            error: error,
        });
    }
};

// Update a to-do item
export const updateTodo = async (req: Request, res: Response) => {
    const id: string = req.body.id;
    const completed: boolean = req.body.completed;

    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set completed = :completed',
        ExpressionAttributeValues: {
            ':completed': completed,
        },
        ReturnValues: 'ALL_NEW',
    });

    try {
        const response = await docClient.send(command);
        handleResponse(
            res,
            httpStatusCode.OK,
            'Success',
            `Todo ID: ${id} has been updated successfully!`,
            response
        );
    } catch (error) {
        handleResponse(
            res,
            httpStatusCode.INTERNAL_SERVER_ERROR,
            'Error',
            'Error in DB Operation!',
            error
        );
    }
};

// Delete a to-do item
export const deleteTodo = async (
    req: Request,
    res: Response
): Promise<void> => {
    const id: string = req.body.id;

    const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
    });

    try {
        await docClient.send(command);
        handleResponse(
            res,
            httpStatusCode.NO_CONTENT,
            'Success',
            `Todo ID: ${id} has been deleted successfully!`
        );
    } catch (error) {
        handleResponse(
            res,
            httpStatusCode.INTERNAL_SERVER_ERROR,
            'Error',
            'Error in DB Operation!',
            error
        );
    }
};
