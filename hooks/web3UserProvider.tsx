import data from './useWeb3User' // Import data container

// Export global provider to encompass application
export default function GlobalWeb3UserProvider({ children }: { children: JSX.Element }) {
  return (
    <>
      <data.Provider>{children}</data.Provider>
    </>
  )
}

// Export data container
export { data }
