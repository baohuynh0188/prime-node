import request from 'supertest';
import { jest } from '@jest/globals';

import app from '../app';
import { mockClient } from 'aws-sdk-client-mock';
import {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    DeleteCommand,
    GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
    v4: jest.fn(),
}));

jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Todo Controller', () => {
    beforeEach(() => {
        ddbMock.reset();
        jest.clearAllMocks();
    });

    describe('GET /api/v1/todos/:id', () => {
        it('should get a todo item by ID', async () => {
            const todoId = '12345';
            ddbMock.on(GetCommand).resolves({
                Item: {
                    id: todoId,
                    title: 'Test Todo',
                    description: 'Test Description',
                    isCompleted: false,
                    cardColor: '#cddc39',
                    timestamps: {
                        completedOn: null,
                        createdOn: new Date().toISOString(),
                        modifiedOn: null,
                    },
                },
            });

            const response = await request(app).get(`/api/v1/todos/${todoId}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                status: 'Success',
                message: `Get to-do item by ID: ${todoId}`,
                data: {
                    Item: {
                        id: todoId,
                        title: 'Test Todo',
                        description: 'Test Description',
                        isCompleted: false,
                        cardColor: '#cddc39',
                        timestamps: {
                            completedOn: null,
                            createdOn: new Date().toISOString(),
                            modifiedOn: null,
                        },
                    },
                },
            });
        });

        it('should return error if todo item not found', async () => {
            const todoId = '12345';
            ddbMock.on(GetCommand).resolves({});

            const response = await request(app).get(`/api/v1/todos/${todoId}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                status: 'Error',
                message: `No Todo found with ID: ${todoId}`,
            });
        });

        it('should return error if there is a DB operation error', async () => {
            const todoId = '12345';
            ddbMock.on(GetCommand).rejects({
                name: 'InternalServerError',
            });

            const response = await request(app).get(`/api/v1/todos/${todoId}`);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                status: 'Error',
                message: 'Error in DB Operation!',
                data: {
                    name: 'InternalServerError',
                },
            });
        });
    });

    describe('POST /api/v1/todos', () => {
        it('should create a new todo item', async () => {
            const todoId = '12345';
            (uuidv4 as jest.Mock).mockReturnValue(todoId);
            ddbMock.on(PutCommand).resolves({});

            const response = await request(app).post('/api/v1/todos').send({
                title: 'Test Todo',
                description: 'Test Description',
            });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                status: 'Success',
                message: 'Todo has been created successfully!',
                data: {
                    id: todoId,
                    title: 'Test Todo',
                    description: 'Test Description',
                    isCompleted: false,
                    cardColor: '#cddc39',
                    timestamps: {
                        completedOn: null,
                        createdOn: new Date().toISOString(),
                        modifiedOn: null,
                    },
                },
            });
            // expect(ddbMock).toHaveReceivedCommand(PutCommand);
        });

        it('should return validation error for invalid data', async () => {
            const response = await request(app).post('/api/v1/todos').send({
                title: 'Te',
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                status: 'Error',
                message: 'Validation error',
                data: expect.any(Array),
            });
        });
    });

    describe('DELETE /api/v1/todos/:id', () => {
        it('should delete a todo item', async () => {
            const todoId = '12345';
            ddbMock.on(GetCommand).resolves({
                Item: { id: todoId },
            });
            ddbMock.on(DeleteCommand).resolves({});

            const response = await request(app).delete(
                `/api/v1/todos/${todoId}`
            );

            expect(response.status).toBe(204);
            // expect(ddbMock).toHaveReceivedCommand(DeleteCommand);
        });

        it('should return error if todo item not found', async () => {
            const todoId = '12345';
            ddbMock.on(GetCommand).resolves({});

            const response = await request(app).delete(
                `/api/v1/todos/${todoId}`
            );

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                status: 'Error',
                message: `No Todo found with ID: 12345`,
            });
        });

        it('should return error if there is a DB operation error', async () => {
            const todoId = '12345';
            ddbMock.on(GetCommand).rejects({
                name: 'InternalServerError',
            });

            const response = await request(app).delete(
                `/api/v1/todos/${todoId}`
            );

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                status: 'Error',
                message: 'Error in DB Operation!',
                data: {
                    name: 'InternalServerError',
                },
            });
        });
    });
});
