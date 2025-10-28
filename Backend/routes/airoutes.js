import express from "express";
import { generateimage, savePin } from "../controllers/aicontrolers.js";
import { isauth } from "../middlewears/isauth.js";

const router = express.Router();

// Route for AI Pin generation (protected by auth middleware)
router.post("/generate-image",isauth, generateimage);
router.post("/savepin",isauth, savePin);

export default router;
