const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

let messages = []; // Store chat messages

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("sendMessage", (data) => {
    const message = {
      id: Date.now(),
      text: data.text,
      deviceId: data.deviceId,
    };

    messages.push(message);
    io.emit("receiveMessage", message); // Broadcast message to all users
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Chat Server is Running...");
});

server.listen(3000, () => console.log("Server started on port 3000"));
