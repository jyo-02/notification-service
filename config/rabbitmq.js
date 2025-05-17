import amqplib from "amqplib";

let channel = null;

export async function getRabbitMQChannel() {
  if (channel) return channel;
  const connection = await amqplib.connect(process.env.RABBITMQ_URI);
  channel = await connection.createChannel();
  return channel;
}
