import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { MailTemplate } from './MailTemplate.mjs';

dotenv.config();
const SMTP_SERVER = process.env.SMTP_SERVER

const transporter = nodemailer.createTransport({
  // service: 'sendgrid',
  host: SMTP_SERVER,
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});
console.log("USER", process.env.USER)
export const sendMail = async ({ expiryDate, to, name, subject, link, text }) => {
  try {
    const mailOptions = {
      from: {
        //name: "CHLTC Club Staff Team",
        address: "newsletter2@chltc.co.uk",
      },
      to,
      text,
      subject,
      html: MailTemplate({ name, expiryDate, link }),
      // text: 'This is a test email.',
    };

    await transporter.sendMail(mailOptions);
    console.log('mail send successfully');
  } catch (error) {
    console.log(error);
  }
}