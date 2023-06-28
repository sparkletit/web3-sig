const amqp = require("amqplib/callback_api");
const { exec } = require("child_process");
const fs = require("fs");

// 建立与RabbitMQ的连接
amqp.connect("amqp://rabbitmq", (err, connection) => {
    if (err) {
        console.error("Failed to connect to RabbitMQ:", err);
        return;
    }

    // 创建频道
    connection.createChannel((err, channel) => {
        if (err) {
            console.error("Failed to create channel:", err);
            return;
        }

        // 声明队列
        const queueName = "build_queue";
        channel.assertQueue(queueName, { durable: false });

        console.log("Waiting for messages...");

        // 接收消息并处理
        channel.consume(queueName, (msg) => {
            if (msg === null) {
                // 队列中没有消息，等待新的消息
                return;
            }

            const envData = msg.content.toString();

            // 执行构建操作
            runBuild(envData)
                .then(() => {
                    // 构建完成后，确认消息已处理
                    channel.ack(msg);
                })
                .catch((error) => {
                    // 发生错误，可以选择重新将消息放回队列等待重试
                    console.error("Error occurred during build:", error);
                    channel.nack(msg);
                });
        });
    });
});

async function runBuild(envData) {
    // 将.env数据写入Next.js的.env文件
    fs.writeFileSync(".env2", envData);

    // 运行npm run build命令
    return new Promise((resolve, reject) => {
        exec("npm run build", (error, stdout, stderr) => {
            if (error) {
                console.error("Build failed:", error);
                reject(error);
            } else {
                console.log("Build completed successfully");
                resolve();
            }
        });
    });
}
