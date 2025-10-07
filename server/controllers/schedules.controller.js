const pool = require("../utils/dbConnection");
const cron = require("node-cron");
const {
  responseCreator,
  errorCreator,
} = require("../utils/responseCreator");
const { scheduleNewJob, unscheduleJob } = require("../utils/schedulesHelper.util");

const getSchedulesController = async (req, res, next) => {
  try {
    const results = await pool.query(
      `SELECT s.id, s.job_name, s.cron_string, s.created_at, u.username as created_by
      FROM schedules s
      JOIN users u ON s.created_by_user_id = u.id
      ORDER BY s.created_at DESC;`
    );
    if (!results?.rows) {
      errorCreator(`Error Fetching Schedules`, 500);
    }
    res.send(
      responseCreator(`Successfully fetched All Schedules`, results.rows)
    );
  } catch (error) {
    next(error);
  }
};


const createSchedulesController = async (req, res, next) => {
  try {
    const { job_name, cron_string } = req.body;
    const { id: userId } = res.locals.user;

    if (!job_name || !cron_string) {
      errorCreator(`Missing Scheduling Details`, 404);
    }

    if (!cron.validate(cron_string)) {
      errorCreator(`Invalid Cron Pattern`, 400);
    }

    const result = await pool.query(
      `INSERT INTO schedules (job_name,cron_string,created_by_user_id) 
      VALUES ($1,$2,$3) RETURNING *;`,
      [job_name, cron_string, userId]
    );
    if(!result.rows){
      errorCreator(`Error Creating Schedule!`,500);
    }

    const newSchedule = result.rows[0];
    if(newSchedule){
      scheduleNewJob(newSchedule);
    }

    res
      .status(201)
      .send(
        responseCreator(`New Schedule Created Successfully!`, newSchedule)
      );
  } catch (error) {
    if(error.code === '23505'){
      errorCreator(`Duplicate Schedule!`,400);
    }
    console.log(`Error Creating Schedule: `,error);
    next(error);
  }
};
const deleteSchedulesController = async (req, res, next) => {
  try {
    const {id} = req.params;
    const result = await pool.query(
      `DELETE FROM schedules WHERE id = $1 RETURNING *;`,
      [id]
    )

    if(result.rowCount === 0){
      errorCreator(`No Such Schedules Found!`,404);
    }
    unscheduleJob(parseInt(id,10));

    res.status(200).send(responseCreator(`Succefully Deleted Schedule!`));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getSchedulesController,
  createSchedulesController,
  deleteSchedulesController,
};
