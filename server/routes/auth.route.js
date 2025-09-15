const express = require("express");
const { signupController, loginController, loginWithTokenController, logoutController } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");


const authRouter = express.Router();

authRouter.post("/signup",signupController);
authRouter.post("/login", loginController);
authRouter.post("/login-with-token", loginWithTokenController);
authRouter.get("/logout", logoutController);

module.exports = authRouter;
