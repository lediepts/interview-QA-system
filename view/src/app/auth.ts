import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from 'utils/axiosClient'
import { useAppDispatch, useAppSelector } from './hooks'
import { UIAction } from './slices/UI'

export const useAuth = () => {
  const nav = useNavigate()

  const info = useAppSelector((s) => s.UI.auth)
  const [loading, setLoading] = useState(false)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const getAuth = async () => {
      if (!info) {
        setLoading(true)
        try {
          const { data } = await axiosClient.get('/auth')
          dispatch(UIAction.setAuth(data))
        } catch {
          nav('/login')
        } finally {
          setLoading(false)
        }
      }
    }
    getAuth()
  }, [info, dispatch, nav])

  return { loading }
}
