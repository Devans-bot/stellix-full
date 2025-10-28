
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userdata } from '../context/usercontext'
import { Loadinganimation } from '../components/loading'
import { Pindata } from '../context/pincontext'
import BackButton from '../components/backbutton'


const Login = () => {

  const { isauth, loading } = userdata()

  if (loading) return <p>Loading...</p>
  if (isauth) return <navigate to="/" />
  const [state,setstate]=useState(false)
  const { fetchpins } = Pindata()
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')

  const { loginuser, btnloading } = userdata()
  const navigate = useNavigate()

  const submithandler = (e) => {
    e.preventDefault()

   if( loginuser(email, password, navigate, fetchpins)){
    setstate(true)
   }
  }

  return (
    <> 
    <div className='w-full h-full flex items-center justify-center'>
    <div className='max-w-md bg-black h-screen   overflow-hidden shadow-lg'>
          
          {/* Logo */}
          <BackButton/>
        

          {/* Heading */}
          <h2 className='text-center text-white mt-10 text-md '>Log in to see more</h2>

          {/* Login Form */}
          <form onSubmit={submithandler}>
            <div className='text-white mt-10 flex flex-col items-center justify-centre'>

             
              <input
                type="email"
                className='common-input'
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder='Email'
              />

              
              <input
                type="password"
                className='common-input '
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                placeholder='Password'
              
              />

{email && password && (
                <button
                  type='submit'
                  className='bg-blue-600 active:bg-red-600 hover:bg-red-600 transition duration-100 ease-in-out w-30 mr-50 h-10 rounded-lg text-white mt-6'
                  disabled={btnloading}
                >
                  {btnloading ? <Loadinganimation /> : "Log in"}
                </button>
              )}

            </div>
          </form> 

          {/* Divider */}
         

          {/* Register and Forgot Password */}
          <div className='mt-6 flex flex-col sm:flex-row sm:justify-between items-center text-sm px-2'>

          
            <Link className=' absolute bottom-4 text-white hover:underline mt-2 sm:mt-0' to="/forgot-password">
              Forgot Password ? 
            </Link>
          </div>

        </div>
    </div>
       
      
    </>
  )
}

export default Login
