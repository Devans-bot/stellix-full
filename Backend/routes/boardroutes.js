import express from "express";
import { isauth } from "../middlewears/isauth.js";
import { addpinstoboard, addpintoboard, boardpins, deleteboard, deleteboardpin, delteboardpins, newboard, relatedpinsinboard, singleboard, updatename, userboards } from "../controllers/boardcontrollers.js";


const router=express.Router()

router.post("/relatedpinsinboard",isauth,relatedpinsinboard)

router.post("/newboard",isauth,newboard)

router.get("/userboards",isauth,userboards)
router.post("/addpins/toboard",isauth,addpinstoboard)
router.post("/deletepins",isauth,delteboardpins)
router.get("/single/:id",isauth,singleboard)
router.post("/boardpins/:id",isauth,boardpins)
router.post("/newpin/:id",isauth,addpintoboard)
router.put("/update/:id",isauth,updatename)
router.post("/deleteboard/:id",isauth,deleteboard)
router.post("/deletepin/:id",isauth,deleteboardpin)
router.get("/boarding/:id",isauth,singleboard)


export default router