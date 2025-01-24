import { useState } from 'react'
import { NextPage } from 'next'
import { LoginModal } from '@components/loginWindow/LoginModal'

const Login: NextPage = () => {
  const [openLogin, setOpenLogin] = useState(true)
  return (
    <>
      <LoginModal
        openLogin={openLogin}
        setOpenLogin={setOpenLogin}
        onClick={() => setOpenLogin(false)}
      />
    </>
  )
}

export default Login
