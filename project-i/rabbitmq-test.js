import { connect } from "https://deno.land/x/amqp@v0.23.1/mod.ts";

const connectionOptions = {
    hostname: "localhost", // RabbitMQ 主机名或 IP 地址
    port: 5672,     // RabbitMQ 端口
    username: "guest", // 从 .env 文件读取用户名
    password: "guest", // 从 .env 文件读取密码
  };

const connection = await connect(connectionOptions);
const channel = await connection.openChannel();

// 声明队列
const queueName = "submission_queue";
await channel.declareQueue({ queue: queueName });

const message = {
    code: `
def hello():
    return "Hello"

`,  // Python code to be graded

    assignmentId: 1,

    submissionId: 123,
};

await channel.publish(
    { routingKey: queueName },
    { contentType: "application/json" },
    new TextEncoder().encode(JSON.stringify(message))
  );
  
  console.log("Message sent to RabbitMQ queue:", message);
  
  // 关闭连接
  await channel.close();
  await connection.close();

// deno run --allow-net rabbitmq-test.js 

