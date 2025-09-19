const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const auditorMiddleware = require("../middlewares/auditor.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const {
	createBackup,
	getAllBackups,
	downloadBackup,
  deletingBackup,
} = require("../controllers/backupController");

const backupRouter = express.Router();

backupRouter.post("/", authMiddleware, adminMiddleware, createBackup);
backupRouter.get("/", authMiddleware, getAllBackups);
backupRouter.get(
	"/:id/download",
	authMiddleware,
	downloadBackup
);
backupRouter.delete(
	"/:id/delete",
	authMiddleware,
	adminMiddleware,
	deletingBackup
);

module.exports = backupRouter;
