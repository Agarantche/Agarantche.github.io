import { createContext, useContext } from 'react'

export const AppContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  scrollTo: () => {},
  reduced: false,
})

export const useApp = () => useContext(AppContext)
