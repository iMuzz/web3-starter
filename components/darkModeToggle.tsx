import { useTheme } from 'next-themes'

import Button from './button'

/**
 * Button to toggle dark/light mode.
 */
const DarkModeToggle = () => {
  const { theme, systemTheme, setTheme } = useTheme() // next-themes hook to enable dark mode

  const getNextTheme = () => {
    if (theme === 'system') {
      return systemTheme === 'light' ? 'dark' : 'light'
    } else {
      return theme === 'light' ? 'dark' : 'light'
    }
  }

  const handleToggle = () => {
    setTheme(getNextTheme())
  }

  return <Button onClick={handleToggle}>{getNextTheme() === 'dark' ? 'gn' : 'gm'}</Button>
}

export default DarkModeToggle
