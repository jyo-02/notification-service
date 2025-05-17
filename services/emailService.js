import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmailNotification({ to, content }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Notification",
      text: content,
    });

    console.log(`Email sent: ${info.messageId}`);

    return { success: true };

  } catch (err) {

    console.error("Email sending failed:", err);
    
    return { success: false, error: err.message };
  }
}
