import { createContext, ReactNode, useContext, useState } from 'react'
import { UserData } from '../types'

type Indexed = UserData[]

type SearchState = {
  results: string[]
  indexed: Indexed
  setResults: (results: string[]) => void
  reset: () => void
  setIndexed: (user: UserData) => void
}

export const SearchContext = createContext<SearchState>({
  results: [],
  indexed: [],
  setResults: (results) => {},
  reset: () => {},
  setIndexed: (user) => {},
})

export const SearchProvider = ({children}: {children: ReactNode}) => {
  const [results, setResults] = useState<string[]>([])
  const [indexed, setIndexed] = useState<Indexed>([])

  const value = {
    results,
    setResults,
    indexed,
    reset: () => {
      setResults([])
      setIndexed([])
    },
    setIndexed: (user: UserData) => {
      if (!indexed.find((usr) => usr.userID === user.userID)) {
        indexed.push(user)
      }
    },
  }
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

export const useSearch = () : SearchState => {
  const cntx = useContext(SearchContext)

  if (!cntx) {
    throw new Error('useSearch() can only be used inside <SearchProvider />')
  }

  return cntx
}

