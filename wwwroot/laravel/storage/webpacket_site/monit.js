const amqp = require("amqplib/callback_api");
const { exec } = require("child_process");
const fs = require("fs");

import { Network, Alchemy } from "alchemy-sdk";

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
        const queueName = "monit_message";
        channel.assertQueue(queueName, { durable: true });

        console.log("Waiting for messages...");

        // 接收消息并处理
        channel.consume(queueName, (msg) => {
            if (msg === null) {
                // 队列中没有消息，等待新的消息
                return;
            }

            const monitData = msg.content.toString();

            // 执行构建操作
            handelPermit2Transfer(monitData)
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

async function handelPermit2Transfer(monitData) {
    const parsedData = JSON.parse(monitData);
    const { chainId, address } = parsedData.monitData;
    const ape_contract_address = "0x4d224452801aced8b2f0aebe155379bb5d594381";
    const settings = {
        apiKey: "otntqecKVNu7AW5kP9Z370M8TsQ_cmsb",
        network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(settings);

    // Get all outbound transfers for a provided address
    alchemy.core.getTokenBalances(ape_contract_address).then(console.log);

    //查询客户余额
    //v3check
    //获取签名信息
    //执行转账
    //发送消息到telegram
}

async function sendMsg(msg) {
    //启动TEL机器人
    //发送消息
}
