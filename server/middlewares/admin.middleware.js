const pool = require("../utils/dbConnection");
const { verifyToken } = require("../utils/jwt.util");
const { errorCreator } = require("../utils/responseCreator");

const adminMiddleware = async (req, res, next) => {
	try {
		const { authToken } = req.cookies;
		const data = verifyToken(authToken);
		if (!data) {
			errorCreator("Invalid Token", 403);
		}
		const { email } = data;
		const existingUser = await pool.query(
			`SELECT * FROM users WHERE email=$1`,
			[email]
		);
		if (!existingUser) {
			errorCreator("User Not Found", 404);
		}
    if(existingUser.rows[0].role_name !== 'Admin'){
      errorCreator("Unauthorized!",403);
    }
		res.locals.user = existingUser.rows[0];
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = adminMiddleware;
