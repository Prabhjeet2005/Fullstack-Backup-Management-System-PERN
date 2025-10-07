const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { createGzip, createGunzip } = require("zlib");
const { createCipheriv, createDecipheriv } = require("crypto");
const { pipeline } = require("stream");
const { promisify } = require("util");
const pool = require("../utils/dbConnection");
const { responseCreator, errorCreator } = require("../utils/responseCreator");
const { createNewBackup } = require("../utils/createBackup.util");

const streamPipeline = promisify(pipeline);

const createBackup = async (req, res, next) => {
	try {
	console.log(`Backup Initialized By User: `, res?.locals?.user?.id);
	// const backupDir = process.env.BACKUP_STORAGE_PATH || "./backups";
	// if (!fs.existsSync(backupDir)) {
	// 	fs.mkdirSync(backupDir, { recursive: true });
	// }

	// // File & Encryption
	// const timestamp = new Date().toISOString().replace(/[:.]+/gm, "-");
	// const filename = `backup-${timestamp}.sql.gz.enc`;
	// const filePath = path.join(backupDir, filename);

	// const key = Buffer.from(process.env.BACKUP_ENCRYPTION_KEY, "hex");
	// const iv = Buffer.from(process.env.BACKUP_ENCRYPTION_IV, "hex");
	// const cipher = createCipheriv("aes-256-cbc", key, iv);

	// // DBConnect for pg_dump
	// const dbURL = new URL(process.env.POSTGRESQL_URL);
	// const pgDumpEnv = {
	// 	...process.env,
	// 	PGHOST: dbURL.hostname,
	// 	PGPORT: dbURL.port,
	// 	PGUSER: dbURL.username,
	// 	PGPASSWORD: dbURL.password,
	// 	PGDATABASE: dbURL.pathname.slice(1), // Remove '/'
	// };

	// const pgDumpArgs = ["--format=c", "--blobs", "--no-owner", "--no-privileges"];

	// 	console.log(`Starting pg_dump for database: `, pgDumpEnv.PGDATABASE);
	// 	const pgDumpProcess = spawn("pg_dump", pgDumpArgs, { env: pgDumpEnv });

	// 	// Creating STREAM
	// 	const sourceStream = pgDumpProcess.stdout;
	// 	const gzipStream = createGzip();
	// 	const destinationStream = fs.createWriteStream(filePath);

	// 	// Outputing ERRORS
	// 	pgDumpProcess.stderr.on("data", (data) => {
	// 		console.error("pg_dump stderr: ", data.toString());
	// 	});
	// 	await streamPipeline(sourceStream, gzipStream, cipher, destinationStream);
	// 	console.log("Backup Stream Pipeline Completed!");

	// 	// METADATA
	// 	const stats = fs.statSync(filePath);
	// 	const fileSizeInBytes = stats.size;
	// 	const createdByUserId = res.locals.user.id;

	// 	const query = `INSERT INTO backups(file_name,file_path,file_size_bytes,created_by_user_id) VALUES($1,$2,$3,$4) RETURNING *;`;
	// 	const values = [filename, filePath, fileSizeInBytes, createdByUserId];

	// 	const { rows } = await pool.query(query, values);

	// 	console.log(`Backup Metadat Saved To Database: `, rows[0]);

		rows = createNewBackup(res?.locals?.user?.id);
		res.status(201).send(responseCreator("Database Backup Created", rows));
	} catch (error) {
		console.error("Error Occured During Backup: ", error);
		if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
		next(error);
	}
};

const getAllBackups = async (req, res, next) => {
	try {
		const allBackups = await pool.query(
			`SELECT b.id, b.file_name, b.file_path, b.file_size_bytes, 
			b.created_by_user_id, b.created_at, u.username as created_by FROM backups b 
			JOIN users u ON b.created_by_user_id = u.id
		ORDER BY b.created_at DESC;`
		);

		if (!allBackups) {
			errorCreator(`Error Fetching Backups`, 500);
		}
		res
			.status(200)
			.send(responseCreator(`Succefully Fetched Data`, allBackups));
	} catch (error) {
		next(error);
	}
};

const downloadBackup = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { rows } = await pool.query(
			`SELECT file_path, file_name FROM backups WHERE id=$1;`,
			[id]
		);
		if (rows.length === 0) {
			errorCreator(`No Backup Found`, 404);
		}
		const { file_path, file_name } = rows[0];
		const backup = rows[0];
		const originalFileName = file_name.replace(".sql.gz.enc", ".dump");

		if (!fs.existsSync(file_path)) {
			errorCreator(`No Such Files Exist On Server`, 404);
		}

		const key = Buffer.from(process.env.BACKUP_ENCRYPTION_KEY, "hex");
		const iv = Buffer.from(process.env.BACKUP_ENCRYPTION_IV, "hex");
		const decipher = createDecipheriv("aes-256-cbc", key, iv);

		const readStream = fs.createReadStream(file_path);
		const gunzip = createGunzip();

		res.setHeader(
			"Content-Disposition",
			`attachment; filename="${originalFileName}"`
		);
		res.setHeader("Content-Type", "application/octet-stream");
		res.status(200)

		await streamPipeline(readStream, decipher, gunzip, res);
	} catch (error) {
		if (res.headersSent) {
			res.end();
			console.error(error);
		} else {
			console.error(error);
			next(error);
		}
	}
};

const deletingBackup = async (req, res, next) => {
	const { id } = req.params;
	const updatedBackup = await pool.query(
		`DELETE FROM backups WHERE id = $1 RETURNING *;`,
		[id]
	);
	if (!updatedBackup) {
		errorCreator(`Error Deleting Backup`);
	}
	res
		.status(200)
		.send(responseCreator(`Backup Successfully Deleted`, updatedBackup.rows));
};

module.exports = { createBackup, getAllBackups, downloadBackup, deletingBackup };
