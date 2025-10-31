const fs = require("fs");
const path = require("path");
const { createGzip } = require("zlib");
const { createCipheriv } = require("crypto");
const { pipeline } = require("stream");
const { promisify } = require("util");
const { Client } = require("pg");
const { put } = require("@vercel/blob");
const { to } = require("pg-copy-streams"); // Correct import
const pool = require("../utils/dbConnection");

const streamPipeline = promisify(pipeline);

// Helper function to get all tables in your database
async function getTableNames() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `);
    // Filter out Vercel's internal tables
    return res.rows
      .map((row) => row.tablename)
      .filter((name) => !name.startsWith("_vercel_"));
  } finally {
    client.release();
  }
}

// Helper function to stream one table
async function streamTableToBackup(client, tableName, mainWriteStream) {
  return new Promise((resolve, reject) => {
    console.log(`-- Backing up table: ${tableName}`);
    const query = `COPY public."${tableName}" TO STDOUT WITH CSV HEADER`;
    const copyStream = client.query(to(query));

    // Pipe this table's stream into the main stream
    // IMPORTANT: { end: false } prevents this one stream from closing the entire backup file
    copyStream.pipe(mainWriteStream, { end: false });

    copyStream.on("end", () => {
      console.log(`-- Finished table: ${tableName}`);
      resolve();
    });
    copyStream.on("error", (err) => {
      console.error(`Error backing up table ${tableName}:`, err);
      reject(err);
    });
  });
}

const createNewBackup = async (userId) => {
  let tempDumpPath = null;
  let mainClient;

  try {
    // 1. Define File Details
    const timestamp = new Date().toISOString().replace(/[:.]+/gm, "-");
    const encryptedFileName = `backup-${timestamp}.csv.gz.enc`;

    // 2. Use Vercel's writable /tmp directory
    const tempDir = path.join("/tmp", "backups");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    tempDumpPath = path.join(tempDir, encryptedFileName);

    // 3. Get all tables to back up
    const tables = await getTableNames();
    if (tables.length === 0) {
      throw new Error("No tables found in the database to backup.");
    }
    console.log(`Starting backup of ${tables.length} tables...`);

    // 4. Create the final output streams
    const writeStream = fs.createWriteStream(tempDumpPath);
    const key = Buffer.from(process.env.BACKUP_ENCRYPTION_KEY, "hex");
    const iv = Buffer.from(process.env.BACKUP_ENCRYPTION_IV, "hex");
    const cipher = createCipheriv("aes-256-cbc", key, iv);
    const gzip = createGzip();

    // 5. Chain the final streams together
    //    [GZIP] -> [CIPHER] -> [FILE]
    gzip.pipe(cipher).pipe(writeStream);

    // 6. Connect a single client for all table copies
    mainClient = new Client({
      connectionString: process.env.POSTGRESQL_URL,
    });
    await mainClient.connect();

    // 7. Loop and stream each table one-by-one into the GZIP stream
    for (const tableName of tables) {
      // We pass 'gzip' as the mainWriteStream
      await streamTableToBackup(mainClient, tableName, gzip);
    }

    // 8. All tables are done, manually end the gzip stream.
    // This will flush all data to the cipher and then to the file.
    console.log("All tables backed up. Finalizing file...");
    gzip.end();

    // Wait for the file stream to finish writing
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
    console.log("Database backup stream to temp file completed!");

    // 9. Upload final encrypted file from /tmp to Vercel Blob
    const stats = fs.statSync(tempDumpPath);
    const fileSizeInBytes = stats.size;
    const blobReadStream = fs.createReadStream(tempDumpPath);

    console.log(`Uploading ${encryptedFileName} to Vercel Blob...`);
    const blob = await put(encryptedFileName, blobReadStream, {
      access: "public",
    });
    console.log("Upload to Vercel Blob complete!");

    // 10. Save Blob URL to Database
    const insertQuery = `INSERT INTO backups(file_name, file_path, file_size_bytes, created_by_user_id) VALUES($1, $2, $3, $4) RETURNING *;`;
    const values = [encryptedFileName, blob.url, fileSizeInBytes, userId];

    const { rows } = await pool.query(insertQuery, values);

    console.log(`Backup Metadata Saved To Database: `, rows[0]);
    return rows[0];
  } catch (error) {
    console.error("Error during backup creation:", error);
    throw error; // Propagate error to controller
  } finally {
    // 11. Cleanup
    if (mainClient) {
      await mainClient.end(); // Close the client
    }
    if (tempDumpPath && fs.existsSync(tempDumpPath)) {
      fs.unlinkSync(tempDumpPath);
      console.log(`Cleaned up temp encrypted file: ${tempDumpPath}`);
    }
  }
};

module.exports = { createNewBackup };
