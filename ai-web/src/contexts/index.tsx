import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

type StateProps = {
  videoId?: string
  promptSelected?: string
  temperature?: number
}

type SetState = Dispatch<SetStateAction<StateProps | null>>

type ContextProps = {
  appState: StateProps | null
  setAppState: SetState
}

const AppContext = createContext({} as ContextProps)

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [appState, setAppState] = useState<StateProps | null>(null)

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
