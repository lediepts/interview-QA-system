import { useAuth } from 'app/auth'
import { createContext, useContext } from 'react'

const AuthContext = createContext({})

const useAuthContext = () => useContext(AuthContext)

function AuthProvider({ children }: { children: JSX.Element }) {
  const auth = useAuth()
  const { loading } = auth
  return (
    <AuthContext.Provider value={auth}>
      <main className="container mx-auto">
        {!loading ? children : <>Loading...</>}
      </main>
    </AuthContext.Provider>
  )
}

export { useAuthContext, AuthProvider }
