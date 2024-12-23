import { appError } from "../middleware/globalErrorHandler.mjs";
import { EmailReport } from "../utils/emailReportTemplate.mjs";
import { sendMail } from "../utils/sendMail.mjs";

export const sendNewsletters = async (req, res, next) => {
  try {
    const { Subject, EmailBody, members, deliveryReport } = req.body;

    if (!Subject || !EmailBody || !members?.length) {
      return next(appError('Subject and EmailBody are required fields!', 400));
    }

    const sendTo = members?.map(({ EMAIL }) => EMAIL);

    const report = await sendMail({ to: sendTo, subject: Subject, html: EmailBody });

    if (deliveryReport) {
      await sendMail({ to: deliveryReport, subject: 'Newsletter sent Report', html: EmailReport(report) });
    }

    console.log('report', report);

    if (report?.error) {
      return next(appError(report?.error))
    }

    res.status(201).json({ data: report, message: 'Newsletter sended successfully!' });
  } catch (error) {
    next(appError(error.message))
  }
};