const amqp = require("amqplib");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

async function sendRequest() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "remote_procedure_queue";
  const request = {
    operation: "some_operation",
    data: { key: "value" },
  };

  channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(request)));

  logger.info("Request sent:", request);

  setTimeout(() => {
    connection.close();
  }, 500);
}

sendRequest();
