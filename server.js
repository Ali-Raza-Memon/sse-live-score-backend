// server.js
const express = require("express");
const http = require("http");
const { EventEmitter } = require("events");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const eventEmitter = new EventEmitter();

app.use(express.json());

// SSE endpoint
app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Event listener for updates
  const listener = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Attach the event listener
  eventEmitter.on("update", listener);

  // Cleanup on client disconnect
  req.on("close", () => {
    eventEmitter.removeListener("update", listener);
  });
});


// Admin API to send messages and teams
app.post("/send-message", express.json(), (req, res) => {
  const message = req.body.message;
  const type = req.body.type;
  const team = req.body.team;
  console.log("message",req.body.message);
  if (message) {
    // Emit the message event
    console.log("type is ",type);
    eventEmitter.emit("message", { message });
    res.status(200).json({ success: true });
  }else {
    res.status(400).json({ error: "Invalid data" });
  }
});



app.post("/send-teams", express.json(), (req,res)=>{
  const team = req.body.team;
  const type = req.body.type;
  if(team){
    console.log("team is ",team);
    console.log("type is ",type)
    eventEmitter.emit("team",{ team });
    res.status(200).json({success:true});
  }else{
    res.status(400).json({error : "Invalid data"})
  }
});

// SSE endpoint for broadcasting messages and teams to clients
app.get("/broadcast-sse", (req, res) => {
  // Set up SSE for broadcasting messages and teams to clients
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Event listener for messages and teams
  const listener = (data) => {
    const type = data.type;

    if (type === "message") {
      // Handle message
      console.log("Received message:", data.message);
    } else if (type === "team") {
      // Handle team
      console.log("Received team:", data.team);
    }
    
    // You can customize the handling of other types if needed

    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Attach the event listener
  eventEmitter.on("message", listener);
  eventEmitter.on("team", listener);

  // Cleanup on client disconnect
  req.on("close", () => {
    eventEmitter.removeListener("message", listener);
    eventEmitter.removeListener("team", listener);
  });
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
