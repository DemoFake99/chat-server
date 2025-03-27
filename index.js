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

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.on("sendMessage", (data) => {
    const message = {
      id: Date.now(),
      text: data.text,
      deviceId: data.deviceId,
    };

    messages.push(message);
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Chat Server is Running...");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
