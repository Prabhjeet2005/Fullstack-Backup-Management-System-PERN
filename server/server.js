require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const { errorHandler } = require("./utils/responseCreator")
const apiHealth = require("./routes/apiHealth.route")


const authRouter = require("./routes/auth.route")
const backupRouter = require("./routes/backup.route")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:`${process.env.CLIENT_URL}`,
  credentials:true,
  methods:["GET","POST","PATCH","DELETE"]
}))

app.use("/api/check-api-health",apiHealth);
app.use("/api/auth",authRouter)
app.use("/api/backups",backupRouter)

app.use(errorHandler)


const PORT = process.env.PORT || 7000;
app.listen(PORT,()=>{
  console.log(`Server Running on ${PORT}`);
})