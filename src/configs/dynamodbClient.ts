import 'dotenv/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Create DynamoDB client
const dynamodbClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

export default dynamodbClient;
