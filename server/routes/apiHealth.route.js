const express = require("express");
const { apiHealthController } = require("../controllers/apiHealth.controller");
const apiHealth = express.Router()

apiHealth.get("/",apiHealthController);

module.exports = apiHealth