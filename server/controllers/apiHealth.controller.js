const pool = require("../utils/dbConnection");
const { responseCreator } = require("../utils/responseCreator");

const apiHealthController = async(req,res,next)=>{
  try {
    const dbResult = await pool.query("select now()");
    const dbTime = dbResult.rows[0].now;

    res.status(200).send(responseCreator("DB Connection Successful",dbTime))
  } catch (error) {
    next(error);
  }
}

module.exports = {apiHealthController}