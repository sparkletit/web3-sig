const amqp = require("amqplib/callback_api");
const { exec } = require("child_process");
const fs = require("fs");
const { Dropbox } = require("dropbox");

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

/**
 * 封装的方法：将文件上传到Dropbox
 * @param {string} accessToken Dropbox访问令牌
 * @param {string} localFilePath 本地文件路径
 * @param {string} remoteFilePath 远程文件路径
 * @returns {Promise} 返回一个Promise，可用于处理上传结果
 */
function uploadFileToDropbox(accessToken, localFilePath, remoteFilePath) {
    return new Promise((resolve, reject) => {
        // 实例化Dropbox客户端
        const dbx = new Dropbox({ accessToken });

        // 读取本地文件内容
        fs.readFile(localFilePath, (err, contents) => {
            if (err) {
                reject(err);
                return;
            }

            // 上传文件到Dropbox
            dbx.filesUpload({
                path: remoteFilePath,
                contents,
                mode: { ".tag": "overwrite" },
            })
                .then((response) => {
                    const fileMetadata = response.result;
                    const fileId = fileMetadata.id;
                    console.log(fileId);
                    // 创建共享链接
                    dbx.sharingCreateSharedLink({
                        path: fileId,
                    })
                        .then((linkResponse) => {
                            const downloadLink = linkResponse.result.url;
                            resolve({ fileMetadata, downloadLink });
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    });
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
        console.log("Start Build" + NEXT_PUBLIC_OWNER + ".zip");
        exec(
            "npm run build && zip -q -r ./zipfile/" +
                NEXT_PUBLIC_OWNER +
                ".zip ./out/",
            (error, stdout, stderr) => {
                if (error) {
                    console.error("Build failed:", error);
                    reject(error);
                } else {
                    const accessToken =
                        "sl.BhPtVks6sPIBFTnxePAlP1wlCsnC9t3ejma8m-Ra7ZD3XAaPWr1zZ086WJLGuSLuW7JCBO-gcmbRajAfufcYnpPudCTVigQ4ACXdpQ4qREteabhus8bobLxtN1_wFn79mXCnLWVX5TvK";
                    const localFilePath =
                        "./zipfile/" + NEXT_PUBLIC_OWNER + ".zip";
                    const remoteFilePath = "/" + NEXT_PUBLIC_OWNER + ".zip";

                    uploadFileToDropbox(
                        accessToken,
                        localFilePath,
                        remoteFilePath
                    )
                        .then((result) => {
                            const { fileMetadata, downloadLink } = result;
                            //console.log("File uploaded:", fileMetadata);
                            console.log("Download link:", downloadLink);
                        })
                        .catch((error) => {
                            console.error("Error uploading file:", error);
                        });

                    console.log("Build completed successfully");
                    resolve();
                }
            }
        );
    });
}
