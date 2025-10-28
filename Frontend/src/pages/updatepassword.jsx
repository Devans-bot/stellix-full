import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/backbutton'

const Updatepassword = () => {
  const [crntpswrd, setcrntpswrd] = useState("")
  const [newpswrd, setnewpswrd] = useState("")
  const navigate=useNavigate()

  const submithandler = async (e) => {
    e.preventDefault() // stop page refresh

    try {
      const { data } = await axios.post("/api/user/updatepassword", {
        currentpassword: crntpswrd,
        newpassword: newpswrd,
      })

      toast.success(data.message)
      setcrntpswrd("")
      setnewpswrd("")
      navigate('/account')
    } catch (error) {
      console.error(error)
      toast.error(
        error.response?.data?.message || "Failed to update password"
      )
    }
  }

  return (
    <div className="bg-black h-screen  flex justify-center items-center">
      <form
        onSubmit={submithandler}
        className="flex flex-col gap-4 items-center bg-white/10 p-6 rounded-2xl shadow-md"
      >
        <BackButton/>

        <input
          type="password"
          name="crntpswrd"
          placeholder="Current Password"
          value={crntpswrd}
          onChange={(e) => setcrntpswrd(e.target.value)}
          className="rounded-3xl w-80 h-14  bg-black px-4"
        />
        <input
          type="password"
          name="newpswrd"
          placeholder="New Password"
          value={newpswrd}
          onChange={(e) => setnewpswrd(e.target.value)}
          className="rounded-3xl w-80 h-14 bg-black px-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-2xl px-6 py-3 hover:bg-blue-600"
        >
          Update
        </button>
      </form>
    </div>
  )
}

export default Updatepassword
