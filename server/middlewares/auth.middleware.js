const pool = require("../utils/dbConnection");
const { verifyToken } = require("../utils/jwt.util");
const { errorCreator } = require("../utils/responseCreator");

const authMiddleware = async(req,res,next)=>{
  try {
    const {authToken} = req.cookies;
    if(!authToken){
      errorCreator(`User Is Logged Out`,400)
    }
    const data = verifyToken(authToken);
    if(!data){
      errorCreator("Invalid Token",403);
    }
    const {email} = data;
    const existingUser = await pool.query(`SELECT * FROM users WHERE email=$1`,[email]);
    if(!existingUser){
      errorCreator("User Not Found",404);
    }
    res.locals.user = existingUser.rows[0];
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authMiddleware;