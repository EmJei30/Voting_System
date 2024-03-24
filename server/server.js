const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./Router/Router");
const app = express();
const port = 8000;
const server = http.createServer(app);
const socketIo = require("socket.io");

const io = socketIo(server, {
  //pass the server, solving some cors issues
  cors: {
    //tell the server which server will make the call to our socket.io server
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  },
});
io.on("connection", (socket) => {
  console.log("Client connected");

  // Emit data to client
  socket.emit("data", { message: "Initial data" });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
// Middleware to parse JSON body
app.use(express.json());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(bodyParser.json());

app.use(cors());

// Middleware to console incoming request
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Route handler
app.use("/", router);
app.use("/images", express.static(path.join(__dirname, "images")));

/** Listen for request */
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
module.exports = {
  io, // Export the io object so it can be accessed in other files
};
