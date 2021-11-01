import { useTheme } from 'next-themes'

import Button from './button'

/**
 * Button to toggle dark/light mode.
 */
const DarkModeToggle = () => {
  const { theme, systemTheme, setTheme } = useTheme() // next-themes hook to enable dark mode

  /**
   * Fetches the next theme that would be toggled to
   * @returns 'dark' or 'light'
   */
  const getNextTheme = () => {
    if (theme === 'system') {
      return systemTheme === 'light' ? 'dark' : 'light'
    } else {
      return theme === 'light' ? 'dark' : 'light'
    }
  }

  /**
   * Performs the actual toggle
   */
  const handleToggle = () => {
    setTheme(getNextTheme())
  }

  return <Button onClick={handleToggle}>{getNextTheme() === 'dark' ? 'gn' : 'gm'}</Button>
}

export default DarkModeToggle
