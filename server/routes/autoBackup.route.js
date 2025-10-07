const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { getSchedulesController, createSchedulesController, deleteSchedulesController } = require('../controllers/schedules.controller');

const autoBackupRouter = express.Router();

autoBackupRouter.get("/",authMiddleware,getSchedulesController);
autoBackupRouter.post("/",authMiddleware,adminMiddleware,createSchedulesController);
autoBackupRouter.delete("/:id",authMiddleware,adminMiddleware,deleteSchedulesController);


module.exports = autoBackupRouter;