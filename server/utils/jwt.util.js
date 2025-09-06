const { sign, verify } = require("jsonwebtoken");
const { errorCreator } = require("./responseCreator");

const JWT_SECRET = process.env.JWT_SECRET;

const signToken = (userData, expiresIn = "1d") => {
	try {
		const { email, role_name } = userData;
		const signUser = sign({ email, role_name }, JWT_SECRET, { expiresIn });
		if (!signUser) {
			errorCreator("Error Creating Token", 400);
		}
		return signUser;
	} catch (error) {
		next(error);
	}
};

const verifyToken = (token)=>{
  const verifyUser = verify(token,JWT_SECRET);
  if(!verifyUser){
    errorCreator("Invalid Token Credentials");
  }
  return verifyUser;
}

module.exports = {signToken,verifyToken};