import { useTheme } from 'next-themes'

import Switch from './switch'

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
  const handleThemeChange = () => {
    setTheme(getNextTheme())
  }

  return <Switch onClick={handleThemeChange} />
}

export default DarkModeToggle
