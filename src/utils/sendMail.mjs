import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  service: 'gmail',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: {
        name: "CHLTC Club Staff Team",
        address: "newsletter2@chltc.co.uk",
      },
      to,
      subject,
      html,
    };

    const report = await transporter.sendMail(mailOptions);
    console.log('mail send successfully');
    return report
  } catch (error) {
    console.log('Error in mail sending: ', error);
    return ({ error: error.message });
  }
}