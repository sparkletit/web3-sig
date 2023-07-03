import '../styles/globals.css'
// import 'tailwindcss/tailwind.css'
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'

function getLibrary(provider) {
  try {
    return new Web3(provider)
  } catch (e) {
    console.log(e)
  }
}

function MyApp({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  )
}

export default MyApp
