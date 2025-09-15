const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const auditorMiddleware = require('../middlewares/auditor.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { createBackup, getAllBackups, downloadBackup } = require('../controllers/backupController');

const backupRouter = express.Router()

backupRouter.post("/",authMiddleware,adminMiddleware,createBackup)
backupRouter.get("/",authMiddleware,getAllBackups)
backupRouter.get("/:id/download",authMiddleware,adminMiddleware,downloadBackup)

module.exports = backupRouter