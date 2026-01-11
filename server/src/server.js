import http from "http";
import mongoose from "mongoose";
import app from "./app.js";
import { initSocket } from "./sockets/collab.js";

const server = http.createServer(app);
initSocket(server);



server.listen(5000, () => {
  console.log("Server running on port 5000");
});
