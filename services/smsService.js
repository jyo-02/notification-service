import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSMSNotification({ to, content }) {
  try {
    
    const from = process.env.TWILIO_PHONE_FROM;

    if (!from) throw new Error("Missing TWILIO_PHONE_FROM in .env");

    const message = await client.messages.create({
      body: content,
      from,
      to,
    });

    console.log(`SMS sent: ${message.sid}`);

    return { success: true };

  } catch (err) {
    console.error("SMS sending failed:", err);

    return { success: false, error: err.message };
  }
}
