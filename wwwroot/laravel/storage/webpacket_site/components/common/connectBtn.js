import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'
import { injected } from '../wallet/connectors'

export default function ConnectBtn() {
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React()
  async function connect() {
    try {
      await activate(injected)
      localStorage.setItem('isWalletConnected', true)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
      localStorage.setItem('isWalletConnected', false)
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injected)
          localStorage.setItem('isWalletConnected', true)
        } catch (ex) {
          console.log(ex)
        }
      } else {
        await activate(injected)
        localStorage.setItem('isWalletConnected', true)
      }
    }
    connectWalletOnPageLoad()
  }, [activate])

  function formatAccount(account) {
    const prefix = account.substring(0, 5)
    const postfix = account.substring(account.length - 5)
    return `${prefix}...${postfix}`
  }

  if (account) {
    return (
      <div className='flex flex-col justify-center'>
        <button
          onClick={disconnect}
          style={{ display: 'block' }}
          className='py-2 mt-2 mb-4 ml-2 text-lg font-bold text-white rounded-lg w-40 bg-blue-600 hover:bg-blue-800'>
          {formatAccount(account)}
        </button>
      </div>
    )
  } else {
    return (
      <div className='flex flex-col justify-center'>
        <button
          onClick={connect}
          className='py-2 mt-2 ml-2 mb-4 text-lg font-bold text-white rounded-lg w-40 bg-blue-600 hover:bg-blue-800'>
          Connect wallet
        </button>
      </div>
    )
  }
}
