import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import apiRouter from "./routes/index.js";
import { setupChat } from "./chat.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

// Basic Route
app.get("/", (req, res) => {
  res.send("Electronics Store API is running...");
});

const PORT = process.env.PORT || 5001;

const start = () => {
  // Start HTTP and WebSocket services even if MongoDB is unavailable. Chat is
  // in-memory, so it does not need the database to accept connections.
  const httpServer = http.createServer(app);
  setupChat(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  connectDB().catch((error) => {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error("The API and live chat are running, but database-backed routes may fail until MongoDB is available.");
  });
};

start();
