const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Map to store connected clients
const clients = new Map();

wss.on('connection', function connection(ws) {
    console.log('A new client Connected!');
    ws.send('Welcome to live Score App');
    // Generate a unique identifier for the client
    const clientId = Math.random().toString(36).substring(7);
    clients.set(clientId, ws);

    ws.on('message', function incoming(message) {
        console.log('received from', clientId, ':', message);

        // Broadcast the message to all other clients
        clients.forEach(function each(client, id) {
            if (id !== clientId && client.readyState === WebSocket.OPEN) {
                client.send(`${clientId}: ${message}`);
            }
        });
    });

    ws.on('close', function () {
        console.log('Client disconnected:', clientId);
        clients.delete(clientId);
    });
});

app.get('/', (req, res) => res.send('Hello World!'));

server.listen(5000, () => console.log('Listening on port 5000'));
