import 'dotenv/config';
import app from './app';
import http from 'http';

// Set the PORT
const port = process.env.PORT || '3000';
app.set('port', port);

// Start the Server
const server = http.createServer(app);

server.on('error', (e) => {
    // Handle server errors
    console.error('helo', e);
    process.exit(1);
});

server.listen(port, () => {
    // Log a message when the server is successfully running
    console.log(`Server is running on http://localhost:${port}`);
});
