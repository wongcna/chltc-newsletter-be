import cron from "node-cron";
import { sql } from "../config/db.mjs";
import { sendMail } from "../utils/sendMail.mjs";
import { appError } from "../middleware/globalErrorHandler.mjs";
import { EmailReport, updateEmailBody } from "../utils/emailReportTemplate.mjs";

const PAUSE_TIME = process.env.PAUSE_TIME || 500;

export const createNewsletterSchedule = async (req, res, next) => {

  try {
    const { dateTime, Subject, EmailBody, category, deliveryReport, members } =
      req.body;
    console.log({ dateTime, Subject, EmailBody, category, deliveryReport, members });
    if (!dateTime || !Subject || !EmailBody || !members?.length) {
      return next(appError("Members, Subject and EmailBody are required fields!", 400));
    }

    const scheduledTime = new Date(dateTime);

    if (isNaN(scheduledTime)) {
      return next(appError("Invalid dateTime format", 400));
    }

    if (scheduledTime <= new Date()) {
      return next(appError("Scheduled time must be in the future", 400));
    }

    const membersJson = JSON.stringify(members);
    const result = await sql.query`
    INSERT INTO tblNewsletterSchedules (Subject, EmailBody, dateTime, category, deliveryReport, members)
    VALUES (${Subject}, ${EmailBody}, ${dateTime}, ${category}, ${deliveryReport}, ${membersJson})
    SELECT * FROM tblNewsletterSchedules WHERE Subject = ${Subject} AND EmailBody = ${EmailBody}
  `;

    const cronExpression = `${scheduledTime.getMinutes()} ${scheduledTime.getHours()} ${scheduledTime.getDate()} ${scheduledTime.getMonth() + 1} *`;

    if (result?.recordset && result.recordset.length > 0) {
      const newsletterId = result.recordset[0].ID;

      // Schedule the task using cron
      cron.schedule(cronExpression, async () => {

        const myWaitingTime = (ms) => new Promise((res) => setTimeout(res, ms));

        const report = [];
        for (let i = 0; i < members.length; i++) {
          const member = members[i];
          if (!member.EMAIL) continue;
          console.log("Sending Email to", member.EMAIL);
          const EmailBodyUpdated = updateEmailBody({
            emailBody: EmailBody,
            firstName: member.FNAME,
            lastName: member.SNAME,
            Email: member.EMAIL,
            MID: member.MID,
            CATEGORY: member.CATEGORY
          });
          const tempReport = await sendMail({ to: member.EMAIL, subject: Subject, html: EmailBodyUpdated });
          console.log('Delivery report', tempReport);
          report.push(tempReport);
          await myWaitingTime(PAUSE_TIME).then(() => console.log('waiting done'));
        }

        if (deliveryReport) {
          await sendMail({
            to: deliveryReport,
            subject: "Newsletter sent Report",
            html: EmailReport(report),
          });
        }
        // Delete the newsletter from the database after it's sent
        await sql.query`DELETE FROM tblNewsletterSchedules WHERE ID = ${newsletterId}`;
      });
    }

    if (result?.recordset && result.recordset.length > 0) {
      return res.status(201).json({
        data: result.recordset[0],
        message: "Newsletter scheduled successfully!",
      });
    } else {
      return next(appError("Failed to create the newsletter schedule.", 500));
    }
  } catch (error) {
    next(appError(error.message));
  }
};

export const getNewsletterSchedules = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = "SELECT * FROM tblNewsletterSchedules";
    let params = [];

    if (search) {
      query += " WHERE Subject LIKE @search";
      params.push({
        name: "search",
        type: sql.NVarChar,
        value: `%${search}%`,
      });
    }

    const request = new sql.Request();
    params.forEach((param) => {
      request.input(param.name, param.type, param.value);
    });

    const result = await request.query(query);

    return res.json({
      data: result?.recordset,
      message: "Newsletter schedules fetched successfully!",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

export const getNewsletterScheduleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result =
      await sql.query`SELECT * FROM tblNewsletterSchedules WHERE ID = ${id}`;

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Newsletter not found" });
    }

    return res.json({
      data: result.recordset[0],
      message: "Newsletter template fetchedById successfully!",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

export const updateNewsletterSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Subject, EmailBody, dateTime, category, deliveryReport, members } =
      req.body;

    // Validate the input fields
    if (!dateTime || !Subject || !EmailBody || !members?.length) {
      return next(
        appError("Subject, EmailBody, and members are required fields!", 400)
      );
    }

    const scheduledTime = new Date(dateTime);

    if (isNaN(scheduledTime)) {
      return next(appError("Invalid dateTime format", 400));
    }

    if (scheduledTime <= new Date()) {
      return next(appError("Scheduled time must be in the future", 400));
    }

    const result = await sql.query`
      SELECT * FROM tblNewsletterSchedules WHERE ID = ${id}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Newsletter template not found" });
    }

    const existingSchedule = result.recordset[0];

    if (existingSchedule.cronJob) {
      existingSchedule.cronJob.stop(); // Stop the old cron job
    }

    const cronExpression = `${scheduledTime.getMinutes()} ${scheduledTime.getHours()} ${scheduledTime.getDate()} ${
      scheduledTime.getMonth() + 1
    } *`;

    const sendTo = members?.map(({ EMAIL }) => EMAIL);

    // Create a new cron job with the updated schedule
    cron.schedule(cronExpression, async () => {
      // Send the email
      await sendMail({ to: sendTo, subject: Subject, html: EmailBody });

      // Delete the newsletter from the database after it's sent
      await sql.query`DELETE FROM tblNewsletterSchedules WHERE ID = ${id}`;
    });

    // Update the database with the new schedule details
    const membersJson = JSON.stringify(members);
    const updateResult = await sql.query`
      UPDATE tblNewsletterSchedules
      SET Subject = ${Subject}, EmailBody = ${EmailBody}, dateTime = ${dateTime}, category = ${category},
          deliveryReport = ${deliveryReport}, members = ${membersJson}
      WHERE ID = ${id}
    `;

    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Newsletter template not found" });
    }

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Newsletter template not found" });
    }

    const updatedResult = await sql.query`
      SELECT * FROM tblNewsletterSchedules WHERE ID = ${id}
    `;

    return res.json({
      data: updatedResult.recordset[0],
      message: "Newsletter template updated successfully!",
    });
  } catch (error) {
    next(appError(error.message));
  }
};

export const deleteNewsletterScheduleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result =
      await sql.query`DELETE FROM tblNewsletterSchedules WHERE ID = ${id}`;
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Newsletter not found" });
    }
    return res.json({
      data: {},
      message: "Newsletter template deleted successfully!",
    });
  } catch (error) {
    next(appError(error.message));
  }
};
