export const EmailReport = (data) => {
  const {
    accepted,
    rejected,
    response,
    envelopeTime,
    messageTime,
    messageSize,
  } = data;

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
        <h3 style="color: #4CAF50; text-align: center;">Email Send Report</h3>

        <p><strong>From:</strong> ${process.env.SENDER_NAME}</p>
        <p><strong>Recipients Sent:</strong> ${accepted.length}</p>
        <p><strong>Message Size:</strong> ${messageSize} bytes</p>
        <p><strong>Envelope Time:</strong> ${envelopeTime} ms</p>
        <p><strong>Message Time:</strong> ${messageTime} ms</p>
        <p><strong>SMTP Response:</strong> ${response}</p>

        <p><strong>Accepted Recipients:</strong> ${
          accepted.join(", ") || "None"
        }</p>
        <p><strong>Rejected Recipients:</strong> ${
          rejected.join(", ") || "None"
        }</p>
      </div>
    </div>
  `;
};

export const updateEmailBody = ({
  emailBody,
  firstName,
  lastName,
  Email,
  MID = null,
  CATEGORY = null
}) => {
  let newEmailBody = emailBody
    .replace(/\[FIRSTNAME\]/g, firstName)
    .replace(/\[LASTNAME\]/g, lastName)
    .replace(/\[EMAIL\]/g, Email);
  if (MID) {
    newEmailBody = newEmailBody.replace(/\[MID\]/g, MID);
  }
  if (CATEGORY) {
    newEmailBody = newEmailBody.replace(/\[CATEGORY\]/g, CATEGORY);
  }

  return newEmailBody;
};
