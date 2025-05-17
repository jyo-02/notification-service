import { getRabbitMQChannel } from "../config/rabbitmq.js";

const QUEUE_NAME = "notifications";

export async function publishNotificationJob(notification) {
  const channel = await getRabbitMQChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(notification)), {
    persistent: true,
  });
}

export async function consumeNotificationJobs(onMessage) {
  const channel = await getRabbitMQChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  channel.consume(QUEUE_NAME, async (msg) => {
    if (msg !== null) {
      const notification = JSON.parse(msg.content.toString());
      
      await onMessage(
        notification,
        () => channel.ack(msg), //remove msg if ack
        () => channel.nack(msg)
      );
    }
  });
}
