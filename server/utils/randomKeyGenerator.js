const crypto = require("crypto")

const AES256_32Char = crypto.randomBytes(32).toString('hex');
console.log("🚀 ~ AES256_32Char:", AES256_32Char)

const AES128_16BChar = crypto.randomBytes(16).toString('hex');
console.log("🚀 ~ AES128_16BChar:", AES128_16BChar)


