import 'focus-visible'
import '@/styles/tailwind.css'

import '@rainbow-me/rainbowkit/styles.css'

import {
  getDefaultWallets,
  RainbowKitProvider,
  midnightTheme,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

const { chains, provider } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'DEPTO',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({
          accentColor: 'white',
          accentColorForeground: '#4f46e5',
          borderRadius: 'medium',
          fontStack: 'rounded',
          overlayBlur: 'small',
        })}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
