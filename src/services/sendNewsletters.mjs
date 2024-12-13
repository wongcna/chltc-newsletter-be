import { appError } from "../middleware/globalErrorHandler.mjs";
import { sendMail } from "../utils/sendMail.mjs";

export const sendNewsletters = async (req, res, next) => {
  try {
    const { title, content, category, deliveryReport, members } = req.body;

    if (!title || !content || !members?.length) {
      return next(appError('Title and content are required fields!', 400));
    }

    const sendTo = members?.map(({ email }) => email);

    const report = await sendMail({ to: sendTo, subject: title, html: content });

    console.log('report', report);

    if (report?.error) {
      return next(appError(report?.error))
    }

    res.status(201).json({ data: report, message: 'Newsletter sended successfully!' });
  } catch (error) {
    next(appError(error.message))
  }
};