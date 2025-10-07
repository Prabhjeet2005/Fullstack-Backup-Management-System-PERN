const cron = require("node-cron");
const { createBackup } = require("../controllers/backupController");
const pool = require("./dbConnection");
const { createNewBackup } = require("./createBackup.util");

const allScheduledJobs = new Map();

const backupTask = async (schedule) => {
  console.log(
    `[Scheduler] Running scheduled backup for job: "${schedule.job_name}" (ID: ${schedule.id})`
  );
  try {
    // We pass the user ID so the backup is associated with the user who scheduled it.
    await createNewBackup(schedule.created_by_user_id);
    console.log(
      `[Scheduler] Successfully completed backup for job: "${schedule.job_name}"`
    );
  } catch (error) {
    console.error(
      `[Scheduler] Error running backup for job "${schedule.job_name}":`,
      error
    );
  }
};

const scheduleNewJob = (schedule) => {
  if (!cron.validate(schedule.cron_string)) {
    console.error(`Invalid Cron Pattern`);
  } else {
    // backupTask(schedule)
    const task = cron.schedule(
      schedule.cron_string,
      () => backupTask(schedule),
      {
        scheduled: true,
        timezone: "UTC",
      }
    );
    allScheduledJobs.set(schedule.id, task);
    console.log(
      `Scheduler job ${schedule.job_name} ID: ${schedule.id} scheduled with pattern: ${schedule.cron_string}`
    );
  }
};

const unscheduleJob = (scheduleId) => {
  const job = allScheduledJobs.get(scheduleId);
  if (job) {
    job.stop();
    allScheduledJobs.delete(scheduleId);
    console.log(
      `[Scheduler] Job with Schedule ID ${scheduleId} has been stopped and removed`
    );
  }
};

const startScheduler = async () => {
    console.log(
      "[Scheduler] Initializing and loading schedules from database..."
    );
    try {
      const { rows } = await pool.query("SELECT * FROM schedules;");
      console.log("🚀 ~ startScheduler ~ HERE")
      rows.forEach((schedule) => {
        scheduleNewJob(schedule);
      });
      console.log(
        `[Scheduler] Initialization complete. ${rows.length} jobs loaded.`
      );
    } catch (error) {
      console.error("[Scheduler] Failed to initialize scheduler:", error);
    }
};

module.exports = {
  startScheduler,
  scheduleNewJob,
  unscheduleJob,
};
