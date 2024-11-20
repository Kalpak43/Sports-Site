// Helper function to send email
import * as nodemailer from "nodemailer";

export const sendEmailNotification = async (
  email: string,
  messageContent: any
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kalpakgoshikwar123@gmail.com",
      pass: "vhsi wiup dnwp diek",
    },
  });

  const mailOptions = {
    from: "kalpakgoshikwar123@gmail.com",
    to: email,
    subject:
      (messageContent.image ? "New Image Received" : "New Message Received") +
      ` from ${messageContent.sender}`,
    text: `You have received a new message: "${messageContent.message}"`,
  };

  await transporter.sendMail(mailOptions);

  return "Email sent successfully!";
};
