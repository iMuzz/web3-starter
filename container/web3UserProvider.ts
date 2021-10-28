import data from './web3' // Import data container

// Export global provider to encompass application
export default function GlobalWeb3UserProvider({ children }: { children: JSX.Element }) {
  return <data.Provider>{children}</data.Provider>
}

// Export data container
export { data }
