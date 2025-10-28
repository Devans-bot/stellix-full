import React, { useState } from 'react'
import { Pindata } from '../context/pincontext'
import { useNavigate } from 'react-router-dom'
import { useUpload } from '../context/uploadcontext'
import { Loading, Loadinganimation } from '../components/loading'
import LongLoading from '../components/longloading'

function Create({ onClose }) {
  const { addpin,loading,setloading } = Pindata()
  const { uploadFile, uploadFilePrev, setUploadFile, setUploadFilePrev } = useUpload()

  const [title, settitle] = useState("")
  const [pin, setpin] = useState("")
  const navigate = useNavigate()

  const submithandler = (e) => {
    e.preventDefault()
    const formdata = new FormData()
    formdata.append("title", title)
    formdata.append("pin", pin)
    formdata.append("file", uploadFile)

    addpin(formdata, setUploadFilePrev, setUploadFile, settitle, setpin, navigate)

    // ✅ reset only after submit
    setUploadFile(null)
    setUploadFilePrev(null)

  }

  const cancelHandler = () => {
    // ✅ reset if cancelled
    setUploadFile(null)
    setUploadFilePrev(null)
    navigate(-1) // go back
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <LongLoading/>
      </div>
    )
  }


  return (
    <div className="z-10 md:relative md:left-2/12 md:w-5xl md:flex-row   bg-black overflow-hidden min-h-screen flex flex-col items-center justify-center  ">
      {uploadFilePrev ? (
        <div className="overflow-hidden  h-4/12 w-full max-w-md md:max-w-lg lg:max-w-xl md:max-h-lg mx-auto flex items-center justify-center md:justify-end">
        <img src={uploadFilePrev} alt="preview" className="rounded-2xl h-full mb-4 object-contain max-h-[40vh] md:max-h-[70vh] " />

</div>
      ) : (
        <p className="text-gray-500 md:hidden">No image selected</p>
      )}

      <div className="flex items-center justify-center w-11/12 ">
        <form onSubmit={submithandler}>
          <div>
            <label className="text-sm">Title</label>
            <input
              type="text"
              className="common-input"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              placeholder='Pin Title'
            />

            <label className="text-sm">Pin Tags</label>
            <input
              type="text"
              className="common-input "
              value={pin}
              onChange={(e) => setpin(e.target.value)}
              placeholder='Enter tags eg: nature, art, travel'
            />

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="bg-blue-500   hover:bg-[#4b7091] active:bg-[#346087] transition duration-100 ease-in-out w-30 h-10 rounded-lg text-white"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={cancelHandler}
                className="bg-gray-400 hover:bg-gray-500 w-30 h-10 rounded-lg text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Create
