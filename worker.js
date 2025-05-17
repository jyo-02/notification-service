import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Notification from "./models/Notification.js";
import User from "./models/User.js";
import { consumeNotificationJobs } from "./queues/notificationQueue.js";
import { sendEmailNotification } from "./services/emailService.js";
import { sendSMSNotification } from "./services/smsService.js";
import { sendInAppNotification } from "./services/inAppService.js";

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Worker connected to MongoDB"))
  .catch((err) => console.error("Worker MongoDB connection error:", err));

async function processNotificationJob(job, ack, nack) {
  const MAX_RETRIES = 3;
  try {
    const notification = await Notification.findById(job.notificationId);
    if (!notification) {
      console.error("Notification not found:", job.notificationId);
      return ack();
    }
    const user = await User.findById(notification.userId);
    if (!user) {
      console.error("User not found for notification:", notification._id);
      await Notification.findByIdAndUpdate(notification._id, {
        status: "failed",
      });
      return ack();
    }
    let result;
    if (notification.type === "email") {
      result = await sendEmailNotification({
        to: user.email,
        content: notification.content,
      });
    } else if (notification.type === "sms") {
      result = await sendSMSNotification({
        to: user.phone,
        content: notification.content,
      });
    } else if (notification.type === "inapp") {
      result = await sendInAppNotification({
        to: user._id,
        content: notification.content,
      });
    } else {
      result = { success: false, error: "Unknown notification type" };
    }

    if (result.success) {
      await Notification.findByIdAndUpdate(notification._id, {
        status: "sent",
      });
      console.log(`Notification ${notification._id} sent successfully.`);
      ack();
    } else {
      if ((notification.retries || 0) < MAX_RETRIES) {
        await Notification.findByIdAndUpdate(notification._id, {
          $inc: { retries: 1 },
        });
        console.warn(
          `Notification ${notification._id} failed (attempt ${
            notification.retries + 1
          }/${MAX_RETRIES}). Retrying...`
        );
        nack(); // requeue the job
      } else {
        await Notification.findByIdAndUpdate(notification._id, {
          status: "failed",
        });
        console.error(
          `Notification ${notification._id} failed after ${MAX_RETRIES} attempts. Giving up.`
        );
        ack(); // acknowledge so it's not retried anymore
      }
    }
  } catch (err) {
    console.error("Error processing notification job:", err);
    nack();
  }
}

consumeNotificationJobs(processNotificationJob).then(() => {
  console.log("Worker is listening for notification jobs...");
});
