import { ReactFCWithChildren } from '@renderer/types/props'
import { TAuthStateContext, TUser } from '@renderer/types/types'
import { createContext, useContext, useEffect, useState } from 'react'

const StateContext = createContext<TAuthStateContext>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: false
})

export const AuthContextProvider: React.FC<ReactFCWithChildren> = ({ children }) => {
  const _token = localStorage.getItem('AUTH_TOKEN')
  const [token, _setToken] = useState<string | null>(_token)
  const [user, setUser] = useState<TUser | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUserData = async () => {
      try {
        setUser({
          username: 'test',
          id: 111111
        })
        setToken('token')
      } catch (error) {
        setToken(null)
      }
    }

    getUserData()
  }, [])

  const setToken = (token: string | null) => {
    if (token) {
      _setToken(token)
      localStorage.setItem('AUTH_TOKEN', token)
    } else {
      _setToken(null)
      localStorage.removeItem('AUTH_TOKEN')
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      console.log(email)
      console.log(password)

      setUser({
        username: 'test',
        id: 111111
      })
      setToken('token')
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  const logout = async () => {
    try {
      setToken(null)
    } catch (error) {
      console.error('Logout failed', error)
    }
  }
  return (
    <StateContext.Provider
      value={{
        user,
        token,
        login,
        loading,
        logout
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useAuthContext = () => useContext(StateContext)
