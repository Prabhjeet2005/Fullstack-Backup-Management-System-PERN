// --- START OF DEBUGGING BLOCK ---
// We add this here to see the environment variables BEFORE anything else runs.
require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { errorHandler } = require("./utils/responseCreator");
const apiHealth = require("./routes/apiHealth.route");

const authRouter = require("./routes/auth.route");
const backupRouter = require("./routes/backup.route");
const autoBackupRouter = require("./routes/autoBackup.route");
const { startScheduler } = require("./utils/schedulesHelper.util");

const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.CLIENT_URL
          : "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    })
  );

  app.use("/api/check-api-health", apiHealth);
  app.use("/api/auth", authRouter);
  app.use("/api/backups", backupRouter);
  app.use("/api/schedule-auto-backup", autoBackupRouter);
  app.use("/api/cron/trigger-backup", async (req, res) => {
    try {
      await startScheduler(); // Whatever your scheduled task does
      res.status(200).send("Scheduled backup task executed successfully.");
    } catch (error) {
      console.error("Scheduled task failed:", error);
      res.status(500).send("Scheduled task failed.");
    }
  });

  app.use(errorHandler);

  if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
      console.log(`Server Running on ${PORT}`);
    });
  }

module.exports = app;
