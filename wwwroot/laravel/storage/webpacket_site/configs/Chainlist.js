const CHAIN_DATA_LIST = {
  1: {
    chainId: 1,
    chain: 'ETH',
    network: 'mainnet',
    networkId: 1,
    chainParams: {
      chainName: 'Ethereum Mainnet', // 添加到钱包后显示的网络名称
      rpcUrls: [
        'https://eth-mainnet.g.alchemy.com/v2/otntqecKVNu7AW5kP9Z370M8TsQ_cmsb', // rpc地址
      ],
      // iconUrls: [
      //     'https://testnet.hecoinfo.com/favicon.png' // 网络的图标
      // ],
      blockExplorerUrls: [
        'https://etherscan.io', // 网络对应的区块浏览器
      ],
      nativeCurrency: {
        // 网络主币的信息
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
    },
  },
  3: {
    chainId: 3,
    chain: 'ETH',
    network: 'ropsten',
    networkId: 3,
    chainParams: {
      chainName: 'Ethereum Chain Ropsten',
      rpcUrls: ['https://ropsten.infura.io/'],
      blockExplorerUrls: ['https://ropsten.etherscan.io'],
      nativeCurrency: {
        name: 'RopstenETH',
        symbol: 'RopstenETH',
        decimals: 18,
      },
    },
  },
  4: {
    chainId: 4,
    chain: 'ETH',
    network: 'rinkeby',
    networkId: 4,
    chainParams: {
      chainName: 'Ethereum Chain Rinkeby',
      rpcUrls: ['https://rinkeby.infura.io/v3/'],
      blockExplorerUrls: ['https://rinkeby.etherscan.io'],
      nativeCurrency: {
        name: 'RinkebyETH',
        symbol: 'RinkebyETH',
        decimals: 18,
      },
    },
  },
  5: {
    chainId: 5,
    chain: 'ETH',
    network: 'goerli',
    networkId: 5,
    chainParams: {
      chainName: 'Ethereum Chain Goerli',
      rpcUrls: ['https://goerli.infura.io/v3/'],
      blockExplorerUrls: ['https://goerli.etherscan.io'],
      nativeCurrency: {
        name: 'GoerliETH',
        symbol: 'GoerliETH',
        decimals: 18,
      },
    },
  },
  10: {
    chainId: 10,
    chain: 'OP Mainnet',
    network: 'mainnet',
    networkId: 10,
    chainParams: {
      chainName: 'OP Mainnet', // 添加到钱包后显示的网络名称
      rpcUrls: [
        'https://mainnet.optimism.io', // rpc地址
      ],
      blockExplorerUrls: [
        'https://optimistic.etherscan.io', // 网络对应的区块浏览器
      ],
      nativeCurrency: {
        // 网络主币的信息
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
    },
  },
  56: {
    chainId: 56,
    chain: 'BSC',
    network: 'mainnet',
    networkId: 56,
    chainParams: {
      chainName: 'Smart Chain', // 添加到钱包后显示的网络名称
      rpcUrls: [
        'https://bsc-dataseed.binance.org/', // rpc地址
      ],
      blockExplorerUrls: [
        'https://bscscan.com', // 网络对应的区块浏览器
      ],
      nativeCurrency: {
        // 网络主币的信息
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
    },
  },
  137: {
    chainId: 137,
    chain: 'Polygon LlamaNodes',
    network: 'mainnet',
    networkId: 137,
    chainParams: {
      chainName: 'Polygon LlamaNodes', // 添加到钱包后显示的网络名称
      rpcUrls: [
        'https://polygon.llamarpc.com', // rpc地址
      ],
      blockExplorerUrls: [
        'https://polygonscan.com', // 网络对应的区块浏览器
      ],
      nativeCurrency: {
        // 网络主币的信息
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
    },
  },
  42161: {
    chainId: 42161,
    chain: 'Arbitrum One',
    network: 'mainnet',
    networkId: 42161,
    chainParams: {
      chainName: 'Arbitrum One', // 添加到钱包后显示的网络名称
      rpcUrls: [
        'https://arb1.arbitrum.io/rpc', // rpc地址
      ],
      blockExplorerUrls: [
        'https://arbiscan.io', // 网络对应的区块浏览器
      ],
      nativeCurrency: {
        // 网络主币的信息
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
    },
  },
}

export default CHAIN_DATA_LIST
