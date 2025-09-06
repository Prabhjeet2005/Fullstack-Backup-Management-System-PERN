require("dotenv").config()
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({}))


const PORT = process.env.PORT || 7000;
app.listen(PORT,()=>{
  console.log(`Server Running on ${PORT}`);
})