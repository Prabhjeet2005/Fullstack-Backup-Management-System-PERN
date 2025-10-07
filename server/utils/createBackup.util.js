const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { createGzip, createGunzip } = require("zlib");
const { createCipheriv, createDecipheriv } = require("crypto");
const { pipeline } = require("stream");
const { promisify } = require("util");
const pool = require("../utils/dbConnection");
const {
  responseCreator,
  errorCreator,
} = require("../utils/responseCreator");

const streamPipeline = promisify(pipeline);

const createNewBackup = async (userId) => {
  const backupDir = process.env.BACKUP_STORAGE_PATH || "./backups";
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // File & Encryption
  const timestamp = new Date().toISOString().replace(/[:.]+/gm, "-");
  const filename = `backup-${timestamp}.sql.gz.enc`;
  const filePath = path.join(backupDir, filename);

  const key = Buffer.from(process.env.BACKUP_ENCRYPTION_KEY, "hex");
  const iv = Buffer.from(process.env.BACKUP_ENCRYPTION_IV, "hex");
  const cipher = createCipheriv("aes-256-cbc", key, iv);

  // DBConnect for pg_dump
  const dbURL = new URL(process.env.POSTGRESQL_URL);
  const pgDumpEnv = {
    ...process.env,
    PGHOST: dbURL.hostname,
    PGPORT: dbURL.port,
    PGUSER: dbURL.username,
    PGPASSWORD: dbURL.password,
    PGDATABASE: dbURL.pathname.slice(1), // Remove '/'
  };

  const pgDumpArgs = [
    "--format=c",
    "--blobs",
    "--no-owner",
    "--no-privileges",
  ];

  console.log(`Starting pg_dump for database: `, pgDumpEnv.PGDATABASE);
  const pgDumpProcess = spawn("pg_dump", pgDumpArgs, { env: pgDumpEnv });

  // Creating STREAM
  const sourceStream = pgDumpProcess.stdout;
  const gzipStream = createGzip();
  const destinationStream = fs.createWriteStream(filePath);

  // Outputing ERRORS
  pgDumpProcess.stderr.on("data", (data) => {
    console.error("pg_dump stderr: ", data.toString());
  });
  await streamPipeline(
    sourceStream,
    gzipStream,
    cipher,
    destinationStream
  );
  console.log("Backup Stream Pipeline Completed!");

  // METADATA
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;
  const createdByUserId = userId;

  const query = `INSERT INTO backups(file_name,file_path,file_size_bytes,created_by_user_id) VALUES($1,$2,$3,$4) RETURNING *;`;
  const values = [filename, filePath, fileSizeInBytes, createdByUserId];

  const { rows } = await pool.query(query, values);

  console.log(`Backup Metadat Saved To Database: `, rows[0]);
  return rows[0];
};

module.exports = {createNewBackup}