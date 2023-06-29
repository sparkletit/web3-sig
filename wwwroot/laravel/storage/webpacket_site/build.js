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
        const queueName = "default";
        channel.assertQueue(queueName, { durable: true });

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

function writeEnv(envData) {
    const parsedData = JSON.parse(envData);
    const {
        NEXT_PUBLIC_DOMAIN_WEBSITE,
        NEXT_PUBLIC_SOURCE,
        NEXT_PUBLIC_CHAIN,
        NEXT_PUBLIC_OWNER,
    } = parsedData.envData;
    const NEXT_PUBLIC_ENABLE_TESTNETS = false;

    const envContent = `NEXT_PUBLIC_ENABLE_TESTNETS=${NEXT_PUBLIC_ENABLE_TESTNETS}
NEXT_PUBLIC_DOMAIN_WEBSITE=${NEXT_PUBLIC_DOMAIN_WEBSITE}
NEXT_PUBLIC_SOURCE=${NEXT_PUBLIC_SOURCE}
NEXT_PUBLIC_CHAIN=${NEXT_PUBLIC_CHAIN}
NEXT_PUBLIC_OWNER=${NEXT_PUBLIC_OWNER}`;

    return envContent;
}

async function uploadFile_IPFS(path) {
    const { Web3Storage, File } = await import("web3.storage");
    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwNjVkN0QwODU2ZEM0NTkwN2FmOTE0YTE3NUU4ZEU1Y2UyNEIxNjkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODgwNTE2MjA3NjgsIm5hbWUiOiJkcmFpbmVyIn0.39b-VsOS8LSOIWfx_I9qKRSFTH804jGo_EZT2Ihp76s";
    const storage = new Web3Storage({ token });
    const files = [
        new File(
            ["Hello web3.storage!"],
            "./zipfile/0x9A2fe7021FC94a1B995A9241343A2D9c3F06af3d.zip"
        ),
    ];
    const cid = await storage.put(files);
    console.log("Content added with CID:", cid);
    return cid;
}

async function runBuild(envData) {
    // 将.env数据写入Next.js的.env文件
    const envContent = writeEnv(envData);
    fs.writeFileSync(".env", envContent);
    const parsedData = JSON.parse(envData);
    const {
        NEXT_PUBLIC_DOMAIN_WEBSITE,
        NEXT_PUBLIC_SOURCE,
        NEXT_PUBLIC_CHAIN,
        NEXT_PUBLIC_OWNER,
    } = parsedData.envData;
    // 运行npm run build命令

    return new Promise((resolve, reject) => {
        console.log("Start Build " + NEXT_PUBLIC_OWNER + ".zip");
        exec(
            "npm run build && zip -q -r ./zipfile/" +
                NEXT_PUBLIC_OWNER +
                ".zip ./out/",
            (error, stdout, stderr) => {
                if (error) {
                    console.error("Build failed:", error);
                    reject(error);
                } else {
                    const path = "./zipfile/" + NEXT_PUBLIC_OWNER + ".zip";
                    const cid = uploadFile_IPFS(path);
                    console.log("Build completed successfully");
                    console.log(`https://dweb.link/ipfs/${cid}/zipfile`);
                    resolve();
                }
            }
        );
    });
}
