import { appError } from "../middleware/globalErrorHandler.mjs";
import { EmailReport, updateEmailBody } from "../utils/emailReportTemplate.mjs";
import { sendMail } from "../utils/sendMail.mjs";

const PAUSE_TIME = process.env.PAUSE_TIME || 500;

export const sendNewsletters = async (req, res, next) => {
    /* #swagger.parameters = [{
    "name": "Authorization",
    "in": "header",
    "required": true,
    "type": "string"
  }] */
 /*
 #swagger.description = 'Endpoint to send newsletters to members
 {
  "Subject": "Chun TeEsting",
  "EmailBody": "This is eamil body",
  "members": [{"EMAIL": "cwong@wongcna.com"}],
  "deliveryReport": "chun@chltc.co.uk"
 }
  '
 */
  const myWaitingTime = (ms) => new Promise((res) => setTimeout(res, ms));
  try {
    const { Subject, EmailBody, members, deliveryReport } = req.body;
    console.log({ Subject, EmailBody, members, deliveryReport });
    if (!Subject || !EmailBody || !members?.length) {
      return next(appError('Subject, EmailBody and Members are required fields!', 400));
    }


    const sendTo = members?.map(({ EMAIL }) => EMAIL);

    console.log({ members });

    res.status(201).json({ data: {accepted: sendTo }, message: 'Newsletter Job Submitted Successfully!' });


    const report = [];
    // send individual email
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
    // send report to deliveryReport
    //const report = await sendMail({ to: sendTo, subject: Subject, html: EmailBody });

    if (deliveryReport) {
      await sendMail({ to: deliveryReport, subject: 'Newsletter sent Report', html: EmailReport(report) });
    }

    console.log('report', report.length);

    // if (report?.error) {
    //   return next(appError(report?.error))
    // }


  } catch (error) {
    next(appError(error.message))
  }
};