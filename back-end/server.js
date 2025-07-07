import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import paragraphRoutes from "./routes/paragraphRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import DBconnect from "./DBconnect.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import socketHandler from "./socketHandler.js";
// all the http requests are handled by this
const app = express();
dotenv.config();
DBconnect(process.env.DATABASE_URL);

app.use(
  cors({
    origin: "https://type-rush2-yays.vercel.app", // allow frontend origins , enabling cross origin request handling
    credentials: true, // allow cookies
  })
);

app.use(express.urlencoded({ recursive: true })); // encodes
app.use(express.json());
app.use(cookieParser());

// creating a http server
const server = http.createServer(app);

// attaching the io socket to the http server it also handles cors
// all the websocket requests are handled by this server
const io = new Server(server, {
  // this is socket.io server instance
  cors: {
    origin: "https://type-rush2-yays.vercel.app",
    credentials: true,
  },
});

socketHandler(io);

// USER ROUTES
app.use("/api/v1/users", userRoutes);

app.use("/api/v1/text", paragraphRoutes);

app.use("/api/v1/test", testRoutes);

// all requests come to this http server
// if the request is http express (app) handles this
// if the request is from the socket (io) handles that
server.listen(process.env.PORT, () => {
  console.log("Server is running at port", process.env.PORT);
});
