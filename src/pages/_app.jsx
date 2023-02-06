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
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

const hyperspaceChain = {
  id: 3141,
  name: 'Filecoin Hyperspace',
  network: 'filecoin-hyperspace',
  nativeCurrency: {
    decimals: 18,
    name: 'testnet filecoin',
    symbol: 'tFIL',
  },
  rpcUrls: {
    default: { http: ['https://api.hyperspace.node.glif.io/rpc/v1'] },
    public: { http: ['https://api.hyperspace.node.glif.io/rpc/v1'] },
  },
  blockExplorers: {
    default: { name: 'Filfox', url: 'https://hyperspace.filfox.info/en' },
    gilf: { name: 'Glif', url: 'https://explorer.glif.io/?network=hyperspace' },
  },
  testnet: true,
}

const { chains, provider } = configureChains(
  [hyperspaceChain],
  // [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
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
        coolMode
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
