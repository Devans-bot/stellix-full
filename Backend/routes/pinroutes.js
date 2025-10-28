import express from "express";

import { isauth } from "../middlewears/isauth.js";
import {  createpin,  deletepin, getAllpins, getFollowingPins, getmypins, likes, relatedpins, searchpins, singlepin, updatepin } from "../controllers/pincontrollers.js";
import uploadfile from "../middlewears/multer.js";

const router = express.Router();  // default multer setup (stores file in memory)


router.get("/single/:id", isauth, singlepin);    // 👈 Keep last

router.post("/createpin",isauth, uploadfile, createpin);
router.get("/following",isauth, getFollowingPins);
router.post("/search", searchpins);         // 👈 Make this before any `/:id` route
router.get("/all", isauth, getAllpins);
router.get("/getmypin",isauth,getmypins)
router.post("/relatedpins", isauth, relatedpins);
router.put("/like/:id", isauth, likes);
router.delete("/:id", isauth, deletepin);
router.put("/:id", isauth, updatepin);


export default router