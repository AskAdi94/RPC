const amqp = require("amqplib");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

async function processRequest() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "remote_procedure_queue";

  channel.assertQueue(queue, { durable: false });
  channel.consume(
    queue,
    (message) => {
      const request = JSON.parse(message.content.toString());

      logger.info("Received request:", request);

      // Process the operation and prepare response
      const response = { result: "success" };

      channel.sendToQueue(
        message.properties.replyTo,
        Buffer.from(JSON.stringify(response)),
        {
          correlationId: message.properties.correlationId,
        }
      );

      channel.ack(message);
    },
    { noAck: false }
  );
}

processRequest();
