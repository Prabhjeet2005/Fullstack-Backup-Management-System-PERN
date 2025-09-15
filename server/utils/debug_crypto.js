// debug_crypto.js (Version 2 - with logging)
const crypto = require("crypto");
const fs = require("fs");
const { pipeline } = require("stream/promises");

// Manually load the debug .env file
require("dotenv").config({ path: ".env" });

async function runTest() {
	console.log("--- Starting Encryption/Decryption Test ---");

	// 1. Get Keys from environment
	const keyHex = process.env.BACKUP_ENCRYPTION_KEY;
	const ivHex = process.env.BACKUP_ENCRYPTION_IV;

	// --- NEW: LOG THE LOADED KEYS ---
	console.log("\n--- VERIFYING KEYS LOADED BY SCRIPT ---");
	console.log("Key loaded by script:", keyHex);
	console.log("IV loaded by script:", ivHex);

	if (!keyHex || !ivHex) {
		console.error(
			"❌ FAILURE: One or both keys were not loaded. Check your .env.debug file and path."
		);
		return;
	}

	// This check helps spot invisible characters like spaces or newlines
	console.log(
		`Key check (length ${keyHex.length}, start...end): '${keyHex.substring(
			0,
			4
		)}...${keyHex.substring(keyHex.length - 4)}'`
	);
	console.log(
		`IV check  (length ${ivHex.length}, start...end): '${ivHex.substring(
			0,
			4
		)}...${ivHex.substring(ivHex.length - 4)}'`
	);
	console.log("--- END KEY VERIFICATION ---\n");

	// 2. Validate Key/IV format
	if (keyHex.length !== 64) {
		console.error(
			"❌ FAILURE: BACKUP_ENCRYPTION_KEY is not 64 hex characters long."
		);
		return;
	}
	if (ivHex.length !== 32) {
		console.error(
			"❌ FAILURE: BACKUP_ENCRYPTION_IV is not 32 hex characters long."
		);
		return;
	}

	const key = Buffer.from(keyHex, "hex");
	const iv = Buffer.from(ivHex, "hex");
	const algorithm = "aes-256-cbc";
	const testFile = "test.txt";
	const encryptedFile = "test.enc";
	const decryptedFile = "test.decrypted.txt";

	try {
		// --- ENCRYPTION ---
		console.log("--- Phase 1: Encrypting ---");
		const sourceText = "If you can read this, the test was a success!";
		fs.writeFileSync(testFile, sourceText);

		const cipher = crypto.createCipheriv(algorithm, key, iv);
		const sourceStream = fs.createReadStream(testFile);
		const destinationStream = fs.createWriteStream(encryptedFile);

		await pipeline(sourceStream, cipher, destinationStream);
		console.log("✅ Encryption successful. Created:", encryptedFile);

		// --- DECRYPTION ---
		console.log("\n--- Phase 2: Decrypting ---");
		const decipher = crypto.createDecipheriv(algorithm, key, iv);
		const encryptedSource = fs.createReadStream(encryptedFile);
		const decryptedDestination = fs.createWriteStream(decryptedFile);

		await pipeline(encryptedSource, decipher, decryptedDestination);
		console.log("✅ Decryption successful. Created:", decryptedFile);

		// --- VERIFICATION ---
		console.log("\n--- Phase 3: Verifying ---");
		// ... verification logic ...
	} catch (error) {
		console.error("\n❌❌❌ TEST FAILED DURING STREAMING:", error);
	} finally {
		// ... cleanup logic ...
	}
}

runTest();
