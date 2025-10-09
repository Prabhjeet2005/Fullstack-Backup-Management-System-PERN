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

const startServer = async()=>{
  const app = express();

  await startScheduler();

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? "http://localhost:3000"
          : `${process.env.CLIENT_URL}`,
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    })
  );

  app.use("/api/check-api-health", apiHealth);
  app.use("/api/auth", authRouter);
  app.use("/api/backups", backupRouter);
  app.use("/api/schedule-auto-backup", autoBackupRouter);

  app.use(errorHandler);

  // --- Static File Serving ---
  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, "public")));

  // --- Catch-All Route ---
  // This route serves the React app's index.html for any request that doesn't match an API route
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  const PORT = process.env.PORT || 7000;
  // app.listen(PORT, () => {
  //   console.log(`Server Running on ${PORT}`);
  // });
}
startServer()

module.exports = app;
