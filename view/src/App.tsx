import { AuthProvider } from 'AuthProvider'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { authRoutes, routes } from './routers'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {[...routes, ...authRoutes].map((d) => {
          return (
            <Route
              key={d.path}
              path={d.path}
              element={
                <AuthProvider>
                  <d.element />
                </AuthProvider>
              }
            />
          )
        })}
      </Routes>
    </BrowserRouter>
  )
}

export default App
