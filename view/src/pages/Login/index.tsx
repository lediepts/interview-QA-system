import { yupResolver } from '@hookform/resolvers/yup'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { UIAction } from 'app/slices/UI'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import axiosClient from 'utils/axiosClient'
import * as yup from 'yup'

interface FormInput {
  userName: string
  password: string
  passcode: string
}
const schema = yup.object({
  userName: yup.string().required().email(),
  password: yup.string().required(),
  passcode: yup.string(),
})
function Login() {
  const nav = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
    defaultValues: {},
  })
  const auth = useAppSelector((s) => s.UI.auth)
  useEffect(() => {
    if (auth) {
      nav('/')
    }
  }, [auth, nav])
  const onSubmit: SubmitHandler<FormInput> = async ({
    passcode,
    password,
    userName,
  }) => {
    try {
      if (step === 1) {
        await axiosClient.post('/auth/login', {
          password,
          userName,
        })
        setStep(2)
      } else {
        if (!passcode || passcode.length !== 6)
          throw new Error('Passcode is required')
        const { data: auth } = await axiosClient.post('/auth/login/passcode', {
          passcode,
          userName,
        })
        dispatch(UIAction.setAuth(auth))
        nav('/')
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {step === 1 ? (
        <form
          className="bg-[#fff6] shadow-lg border border-[#fff6] rounded w-full max-w-xs px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <h2 className="text-center text-2xl font-bold my-4">LOGIN</h2>
          <div className="mb-4">
            <label className="text-sm font-bold mb-2" htmlFor="userName">
              ID
            </label>
            <input
              className={errors.userName ? ' border-red-500' : ''}
              id="userName"
              placeholder="xxx@ex.com"
              {...register('userName')}
            />
          </div>
          <div className="mb-6">
            <label className="text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              key="password"
              className={errors.userName ? ' border-red-500' : ''}
              id="password"
              type="password"
              placeholder="******************"
              {...register('password')}
            />
          </div>
          <div className="flex items-center justify-between">
            <button className="primary-btn" type="submit">
              Sign In
            </button>
            <span className="link">Forgot Password?</span>
          </div>
        </form>
      ) : (
        <form
          className="bg-[#fff6] shadow-lg border border-[#fff6] rounded w-full max-w-xs px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <h2 className="text-center text-2xl font-bold my-4">LOGIN</h2>
          <div className="mb-4">
            <label className="text-sm font-bold mb-2">ID</label>
            <input
              disabled
              id="userName"
              placeholder="xxx@ex.com"
              {...register('userName')}
            />
          </div>
          <div className="mb-6">
            <label className="text-sm font-bold mb-2" htmlFor="passcode">
              Passcode
            </label>
            <input
              key="passcode"
              id="passcode"
              className="tracking-[0.5rem]"
              placeholder="******"
              autoComplete="off"
              autoFocus
              {...register('passcode')}
            />
          </div>
          <div className="flex items-center justify-center gap-10">
            <button className="primary-btn" type="submit">
              Login
            </button>
          </div>
        </form>
      )}

      <p className="text-center text-gray-400 text-xs">
        <span className="mr-2">Copyright &copy;2023</span>
        <a
          href="https://github.com/lediepts"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          @lediepts
        </a>
        <span>. All rights reserved.</span>
      </p>
    </div>
  )
}

export default Login
