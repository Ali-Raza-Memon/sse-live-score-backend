const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Map to store connected clients
const clients = new Map();
var count = 1;
wss.on('connection', function connection(ws) {
    console.log('A new client Connected!');
    ws.send(JSON.stringify({ type: 'intial', message: 'Welcome to live Score App' }));

    // Generate a unique identifier for the client
    const clientId = Math.random().toString(36).substring(7);
    clients.set(clientId, ws);

    ws.on('message', function incoming(message) {
        console.log('received from', clientId, ':', message);

                   
            console.log("Hello I am from String. 2");
            // Handle string message
            // console.log('Received string message 111111111111111:', message);

            const parsedMessage = JSON.parse(message);
            console.log('Received string message 111111111111111:', parsedMessage);


            if(parsedMessage.type==='update-score'){
                console.log("UPPPPPPPPPPPPPPPPdate is called");
                
            // Broadcast the string message to all other clients
                clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        // client.send(`${clientId}: ${message}`);
                        
                        client.send(JSON.stringify({ type: 'update-score', team_wise_score: ` ${message} ` }));

                    }
                });
            }
            else if(parsedMessage.type==='create-teams'){

                const { team1, team2 } = parsedMessage;
                console.log('Received team creation message:', team1, team2);
                    
                // Broadcast the team creation message to all clients
                clients.forEach(function each(client) {
                    console.log("team-01 :"+team1 + " ......team-02 :"+team2);
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'create-teams', message: `${team1} vs ${team2}` }));
                    }
                });
                        
            }
            else{
                console.log(parsedMessage.type);
            }

            // if (parsedMessage){
            //     console.log("I am true!!!!!!!!!!!!")
            //     switch (parsedMessage.type){
            //         case 'create-teams':
            //             // Handle team creation message
            //             const { team1, team2 } = parsedMessage;
            //             console.log('Received team creation message:', team1, team2);
            //             // Handle the team creation logic
            //             break;

            //         case 'update-scores':
            //                 // Handle score update message
            //             const { scoreData } = parsedMessage;
            //             console.log('Received score update message:', scoreData);
            //                 // Handle the score update logic
            //             break;

            //         default:
            //                 console.log('Unknown message type:', parsedMessage.type);
            //     }
            // }else {
            //     console.error('Received invalid JSON message:', message);
            // }



           
    
            // Handle JSON message
            // try {
            //     count=0;
            //     const parsedMessage = JSON.parse(message);

            //     // Check if the parsed message has the required properties
            //     if (parsedMessage && typeof parsedMessage.type === 'string') {
            //         console.log(parsedMessage.type);
            //         const parsedMessage = JSON.parse(message);

            //         if (parsedMessage.type === 'create-teams') {
            //             const { team1, team2 } = parsedMessage;
            //             console.log('Received team creation message:', team1, team2);
                
            //             // Broadcast the team creation message to all clients
            //             clients.forEach(function each(client) {
            //                 if (client.readyState === WebSocket.OPEN) {
            //                     client.send(`New Teams Created: ${team1} vs ${team2}`);
            //                 }
            //             });
            //         } else {
            //             // Handle other types of JSON messages
            //             console.log('Received from', clientId, ':', message);

            //             // Broadcast the JSON message to all other clients
            //             clients.forEach(function each(client, id) {
            //                 if (id !== clientId && client.readyState === WebSocket.OPEN) {
            //                     client.send(`${clientId}: ${message}`);
            //                 }
            //             });
            //         }
            //     } else {
            //         console.error('Received invalid JSON message:', message);
            //     }
            // } catch (error) {
            //     console.error('Error parsing message as JSON:', error);
            // }
        
        
    });

    ws.on('close', function () {
        console.log('Client disconnected:', clientId);
        clients.delete(clientId);
    });
});



app.get('/', (req, res) => res.send('Hello World!'));

server.listen(5000, () => console.log('Listening on port 5000'));
