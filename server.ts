import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import winston from "winston";
import dotenv from "dotenv";

import authRoutes from "./server/routes/auth.js";
import swapRoutes from "./server/routes/swap.js";

dotenv.config();

// Logger setup
export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      logger.info("Connected to MongoDB");
    } catch (error: any) {
      logger.error("MongoDB connection error:", error.message);
      logger.error(
        "Make sure your current IP address is on your Atlas cluster's IP whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/"
      );
      logger.error("In MongoDB Atlas, go to Network Access -> Add IP Address -> Allow Access From Anywhere (0.0.0.0/0)");
    }
  } else {
    logger.warn("MONGODB_URI not set. Running without database connection.");
  }

  // Socket.io
  io.on("connection", (socket) => {
    logger.info(`User connected: ${socket.id}`);
    
    socket.on("join", (userId) => {
      socket.join(userId);
      logger.info(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });

  // Make io available to routes
  app.set("io", io);

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  
  app.use("/api/auth", authRoutes);
  app.use("/api/swap", swapRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
