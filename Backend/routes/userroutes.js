import express from "express"
import { followunfollow, forgotpassword, getUserProfile, login, logoutuser, myprofile, registeruser, resetpassword, updatepassword, updateProfilePicture, updateusername } from "../controllers/usercontrollers.js"
import { isauth } from "../middlewears/isauth.js"
import uploadfile from "../middlewears/multer.js";

const router=express.Router()

router.post('/forgot-password', forgotpassword);

router.post('/reset-password',resetpassword)     // ✅ Must be before any :id route
router.post('/reset-password/:token', resetpassword); // ✅ Same
router.get('/me', isauth, myprofile);
router.post('/username', isauth, updateusername);
router.post('/register', registeruser);
router.post('/login', login);
router.post('/updatepasswo  rd', isauth,updatepassword);
router.get('/logout', logoutuser);
router.post('/follow/:id', isauth, followunfollow);
router.post('/dp/:id',isauth,uploadfile,updateProfilePicture)
router.get('/:id', getUserProfile);                  // ⚠️ Always keep this last

export default router