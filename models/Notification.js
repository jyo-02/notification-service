import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["email", "sms", "inapp"], required: true },
  content: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  retries: { type: Number, default: 0 },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
