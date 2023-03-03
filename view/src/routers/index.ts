import Home from 'pages/Home'
import Login from 'pages/Login'
import NotFound from 'pages/NotFound'

interface RouterType {
  path: string
  title?: string
  element: () => JSX.Element | null
  children?: RouterType[]
}

export const authRoutes: RouterType[] = [
  {
    path: '/login',
    element: Login,
  },
]
export const routes: RouterType[] = [
  {
    path: '/',
    element: Home,
  },
  {
    path: '*',
    element: NotFound,
  },
]
