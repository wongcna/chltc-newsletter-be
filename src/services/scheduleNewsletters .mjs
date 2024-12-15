import cron from 'node-cron';
import { sql } from "../config/db.mjs";
import { appError } from "../middleware/globalErrorHandler.mjs";
import { sendMail } from "../utils/sendMail.mjs";

export const createNewsletterSchedule = async (req, res, next) => {
  try {
    const { dateTime, title, content, category, deliveryReport, members } = req.body;

    if (!dateTime || !title || !content || !members?.length) {
      return next(appError('Title and content are required fields!', 400));
    }

    const scheduledTime = new Date(dateTime);

    if (isNaN(scheduledTime)) {
      return next(appError('Invalid dateTime format', 400));
    }

    if (scheduledTime <= new Date()) {
      return next(appError('Scheduled time must be in the future', 400));
    }

    const membersJson = JSON.stringify(members);
    const result = await sql.query`
    INSERT INTO newsletter_schedules (title, content, dateTime, category, deliveryReport, members) 
    VALUES (${title}, ${content}, ${dateTime}, ${category}, ${deliveryReport}, ${membersJson})
    SELECT * FROM newsletter_schedules WHERE title = ${title} AND content = ${content}
  `;

    const cronExpression = `${scheduledTime.getMinutes()} ${scheduledTime.getHours()} ${scheduledTime.getDate()} ${scheduledTime.getMonth() + 1} *`;
    if (result?.recordset && result.recordset.length > 0) {
      const newsletterId = result.recordset[0].id;

      // Schedule the task using cron
      const task = cron.schedule(cronExpression, async () => {
        const sendTo = members?.map(({ email }) => email);
        const report = await sendMail({ to: sendTo, subject: title, html: content });

        // Delete the newsletter from the database after it's sent
        const deleteResult = await sql.query`
            DELETE FROM newsletter_schedules WHERE id = ${newsletterId}
          `;
      });
    }

    if (result?.recordset && result.recordset.length > 0) {
      return res.status(201).json({
        data: result.recordset[0],
        message: 'Newsletter scheduled successfully!'
      });
    } else {
      return next(appError('Failed to create the newsletter schedule.', 500));
    }
  } catch (error) {
    next(appError(error.message))
  }
};

export const getNewsletterSchedules = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM newsletter_schedules';
    let params = [];

    if (search) {
      query += ' WHERE title LIKE @search';
      params.push({
        name: 'search',
        type: sql.NVarChar,
        value: `%${search}%`
      });
    }

    const request = new sql.Request();
    params.forEach(param => {
      request.input(param.name, param.type, param.value);
    });

    const result = await request.query(query);

    return res.json({ data: result?.recordset, message: 'Newsletter schedules fetched successfully!' });
  } catch (error) {
    next(appError(error.message));
  }
};

export const getNewsletterScheduleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await sql.query`SELECT * FROM newsletter_schedules WHERE id = ${id}`;

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    return res.json({ data: result.recordset[0], message: 'Newsletter template fetchedById successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};

export const updateNewsletterSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, dateTime, category, deliveryReport, members } = req.body;

    // Validate the input fields
    if (!dateTime || !title || !content || !members?.length) {
      return next(appError('Title, content, and members are required fields!', 400));
    }

    const scheduledTime = new Date(dateTime);

    if (isNaN(scheduledTime)) {
      return next(appError('Invalid dateTime format', 400));
    }

    if (scheduledTime <= new Date()) {
      return next(appError('Scheduled time must be in the future', 400));
    }

    const result = await sql.query`
      SELECT * FROM newsletter_schedules WHERE id = ${id}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Newsletter template not found' });
    }

    const existingSchedule = result.recordset[0];

    if (existingSchedule.cronJob) {
      existingSchedule.cronJob.stop(); // Stop the old cron job
    }

    const cronExpression = `${scheduledTime.getMinutes()} ${scheduledTime.getHours()} ${scheduledTime.getDate()} ${scheduledTime.getMonth() + 1} *`;

    const sendTo = members?.map(({ email }) => email);

    // Create a new cron job with the updated schedule
    const newCronJob = cron.schedule(cronExpression, async () => {
      // Send the email
      const report = await sendMail({ to: sendTo, subject: title, html: content });

      // Delete the newsletter from the database after it's sent
      const deleteResult = await sql.query`
          DELETE FROM newsletter_schedules WHERE id = ${id}
        `;
    })

    // Update the database with the new schedule details
    const membersJson = JSON.stringify(members);
    const updateResult = await sql.query`
      UPDATE newsletter_schedules
      SET title = ${title}, content = ${content}, dateTime = ${dateTime}, category = ${category}, 
          deliveryReport = ${deliveryReport}, members = ${membersJson}
      WHERE id = ${id}
    `;

    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Newsletter template not found' });
    }

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Newsletter template not found' });
    }

    const updatedResult = await sql.query`
      SELECT * FROM newsletter_schedules WHERE id = ${id}
    `;

    return res.json({ data: updatedResult.recordset[0], message: 'Newsletter template updated successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};

export const deleteNewsletterScheduleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await sql.query`DELETE FROM newsletter_schedules WHERE id = ${id}`;
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }
    return res.json({ data: {}, message: 'Newsletter template deleted successfully!' })
  } catch (error) {
    next(appError(error.message))
  }
};