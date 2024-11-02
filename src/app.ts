import 'dotenv/config';
import express from 'express';
import feedRouter from './routers/feed';

// Create an Express application
const app = express();

const port = process.env.PORT || '3000';

app.use('/feed', feedRouter);

app.listen(port, () => {
    // Log a message when the server is successfully running
    console.log(`Server is running on http://localhost:${port}`);
});
