import { Router } from "express";
import {
  sendNotification,
  getUserNotifications,
} from "../controllers/notificationController.js";

const router = Router();

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Send a notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 68284a9f284eba457c65d0fb
 *               type:
 *                 type: string
 *                 enum: [email, sms, inapp]
 *                 example: sms
 *               content:
 *                 type: string
 *                 example: Hey! How are you?
 *     responses:
 *       201:
 *         description: Notification queued
 *       400:
 *         description: Bad request
 */
router.post("/", sendNotification);

/**
 * @swagger
 * /notifications/users/{id}/notifications:
 *   get:
 *     summary: Get all notifications for a user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         example: 68284a9f284eba457c65d0fb
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get("/users/:id/notifications", getUserNotifications);

export default router;
