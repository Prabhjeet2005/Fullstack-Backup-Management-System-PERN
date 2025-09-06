const { hash, compare, genSalt } = require("bcrypt");
const { errorCreator } = require("./responseCreator");

const generateHashedPassword = async (userPassword) => {
	const salt = await genSalt(10)
	const hashedPassword = await hash(userPassword, salt)
	if (!hashedPassword) {
		errorCreator("Error Hashing Password");
	}
	return hashedPassword;
};

const verifyHashedPassword = async (userPassword, hashedPassword) => {
	const isPasswordSame = await compare(userPassword, hashedPassword);
	if (!isPasswordSame) {
		errorCreator("Password Invalid");
	}
	return isPasswordSame;
};

module.exports = { generateHashedPassword, verifyHashedPassword };
