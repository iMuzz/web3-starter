import data from './data' // Import data container

// Export global provider to encompass application
export default function GlobalProvider({ children }: { children: JSX.Element }) {
  return <data.Provider>{children}</data.Provider>
}

// Export data container
export { data }
