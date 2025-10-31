const { createGunzip } = require("zlib");
const { createDecipheriv } = require("crypto");
const { pipeline } = require("stream");
const { promisify } = require("util");
const pool = require("../utils/dbConnection");
const {
  responseCreator,
  errorCreator,
} = require("../utils/responseCreator");
const { createNewBackup } = require("../utils/createBackup.util");
const fetch = require("node-fetch"); // Make sure node-fetch is in package.json

const streamPipeline = promisify(pipeline);

const createBackup = async (req, res, next) => {
  try {
    console.log(`Backup Initialized By User: `, res?.locals?.user?.id);
    const rows = await createNewBackup(res?.locals?.user?.id);
    res.status(201).send(responseCreator("Database Backup Created", rows));
  } catch (error) {
    console.error("Error Occured During Backup: ", error);
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
      return next(errorCreator(`No Backup Found`, 404));
    }
    const { file_path: blobUrl, file_name } = rows[0];

    // -----------------------------------------------------------------
    // THE FIX: This now correctly handles the .csv.gz.enc file
    // -----------------------------------------------------------------
    const originalFileName = file_name.replace(".csv.gz.enc", ".csv");

    const response = await fetch(blobUrl);
    if (!response.ok) {
      return next(
        errorCreator(`Could not fetch backup file from storage`, 500)
      );
    }

    const key = Buffer.from(process.env.BACKUP_ENCRYPTION_KEY, "hex");
    const iv = Buffer.from(process.env.BACKUP_ENCRYPTION_IV, "hex");
    const decipher = createDecipheriv("aes-256-cbc", key, iv);
    const gunzip = createGunzip(); // We still need this

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${originalFileName}"`
    );
    // Set correct content type for CSV
    res.setHeader("Content-Type", "text/csv");
    res.status(200);

    // Pipeline is correct: Fetch -> Decrypt -> Decompress -> Response
    await streamPipeline(response.body, decipher, gunzip, res);
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
    .send(
      responseCreator(`Backup Successfully Deleted`, updatedBackup.rows)
    );
};

module.exports = {
  createBackup,
  getAllBackups,
  downloadBackup,
  deletingBackup,
};
