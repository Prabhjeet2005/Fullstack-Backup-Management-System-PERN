const pool = require("../utils/dbConnection");
const { signToken, verifyToken } = require("../utils/jwt.util");
const {
  generateHashedPassword,
  verifyHashedPassword,
} = require("../utils/password.util");
const {
  errorCreator,
  responseCreator,
} = require("../utils/responseCreator");

const signupController = async (req, res, next) => {
  try {
    const userData = req.body;
    const { email, username, password: userPassword } = userData;
    if (!email || !username || !userPassword) {
      errorCreator("Some Field is/are missing", 404);
    }
    const userExists = await pool.query(
      `SELECT * FROM users WHERE email=$1`,
      [email]
    );
    if (userExists.rows[0]) {
      errorCreator("User Already Registered!", 400);
    }
    const hashedPassword = await generateHashedPassword(userPassword);
    const defaultRole = "Auditor";

    const newUser = await pool.query(
      `INSERT INTO users(email,username,password_hashed,role_name) VALUES($1,$2,$3,$4) RETURNING *;`,
      [email, username, hashedPassword, defaultRole]
    );

    if (!newUser) {
      errorCreator("Error Creating New User", 400);
    }

    const userRole = newUser.rows[0].role_name;
    const token = signToken({ email, userRole });
    if (!token) {
      errorCreator("Error Creating Token", 400);
    }

    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: "/", // <-- FIX: Added root path
    };

    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
      cookieOptions.sameSite = "none";
    }

    res.cookie("authToken", token, cookieOptions);

    res
      .status(201)
      .send(
        responseCreator("User Registered Successfully!", newUser.rows[0])
      );
  } catch (error) {
    next(error);
  }
};
const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      errorCreator("Email Or Password Missing", 400);
    }
    const existingUser = await pool.query(
      `SELECT * FROM users WHERE email=$1`,
      [email]
    );
    if (!existingUser.rows[0]) {
      errorCreator("User Not Found", 404);
    }
    const user = existingUser.rows[0]; // This Important
    const isPasswordValid = await verifyHashedPassword(
      password,
      user.password_hashed
    );
    if (!isPasswordValid) {
      errorCreator("Invalid Credentials", 401);
    }
    const userRole = user.role_name;
    const token = signToken({ email, userRole });
    if (!token) {
      errorCreator("Error Creating Token", 400);
    }
    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: "/", // <-- FIX: Added root path
    };

    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
      cookieOptions.sameSite = "none";
    }

    res.cookie("authToken", token, cookieOptions);
    res.status(200).send(responseCreator("Logged In Successfully", user));
  } catch (error) {
    next(error);
  }
};
const loginWithTokenController = async (req, res, next) => {
  try {
    const { authToken } = req.cookies;
    if (!authToken) {
      errorCreator("User Is Logged Out", 404);
    }
    const data = verifyToken(authToken);
    if (!data) {
      errorCreator("Invalid Token", 400);
    }
    const { email } = data;
    const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    if (!user) {
      errorCreator("Error Finding User", 400);
    }
    const { password_hashed, ...sanitizedData } = user.rows[0];
    res
      .status(200)
      .send(
        responseCreator("Logged In successfully With Token", sanitizedData)
      );
  } catch (error) {
    next(error);
  }
};
const logoutController = async (req, res, next) => {
  try {
    const { authToken } = req.cookies;
    if (!authToken) {
      errorCreator("User Already Logged Out!", 400);
    }

    // -----------------------------------------------------------------
    // THE FIX:
    // You MUST provide all the same options you used to set the cookie.
    // The most important one you were missing was 'path'.
    // -----------------------------------------------------------------
    const options = {
      httpOnly: true,
      path: "/", // <-- FIX: Added root path
    };

    if (process.env.NODE_ENV === "production") {
      options.secure = true;
      options.sameSite = "none";
    }

    res.clearCookie("authToken", options);
    res.send(responseCreator("Logged Out Successfully!"));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginController,
  loginWithTokenController,
  signupController,
  logoutController,
};
