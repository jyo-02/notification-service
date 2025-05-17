import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { publishNotificationJob } from "../queues/notificationQueue.js";

export async function sendNotification(req, res) {
  try {

    const { userId, type, content } = req.body;
    
    if (!userId || !type || !content) {
      return res
        .status(400)
        .json({ error: "userId, type, and content are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const notification = await Notification.create({
      userId,
      type,
      content,
      status: "pending",
    });

    await publishNotificationJob({ notificationId: notification._id });
    res.status(201).json({ message: "Notification queued", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getUserNotifications(req, res) {
  try {
    const { id } = req.params;
    const notifications = await Notification.find({ userId: id }).sort({
      createdAt: -1,
    });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
