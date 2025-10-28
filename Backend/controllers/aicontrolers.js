


import axios from "axios";
import cloudinary from "cloudinary";
import { analyzeImage } from "../utils/analyzeImages.js";
import { Pin } from "../models/pinmodels.js";

// ✅ Configure Cloudinary (make sure .env has CLOUDINARY_URL)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// ==================================================================
// 🧠 1️⃣ Generate Image (via Pollinations API - 100% Free)
// ==================================================================
export const generateimage = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    // ✅ Pollinations API URL (no token needed)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    // ✅ Download image from Pollinations
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64Image = Buffer.from(response.data, "binary").toString("base64");

    // ✅ Upload to Cloudinary for permanent hosting
    const uploadRes = await cloudinary.v2.uploader.upload(
      `data:image/jpeg;base64,${base64Image}`,
      { folder: "pins" }
    );

    console.log("✅ Image generated via Pollinations:", uploadRes.secure_url);

    // ✅ Return Cloudinary image info
    return res.json({
      image: { url: uploadRes.secure_url, id: uploadRes.public_id },
      prompt,
    });
  } catch (error) {
    console.error("❌ Error generating image:", error.message);
    return res.status(500).json({ error: "Failed to generate image from Pollinations" });
  }
};


// ==================================================================
// 💾 2️⃣ Save Pin (Analyze Image + Store in MongoDB)
// ==================================================================
export const savePin = async (req, res) => {
  try {
    const { title, pin, image } = req.body;

    if (!pin) return res.status(400).json({ error: "Pin description required" });
    if (!image?.url) return res.status(400).json({ error: "Image URL required" });

    // ✅ Download the image as buffer
    const response = await axios.get(image.url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    const mimeType = response.headers["content-type"] || "image/jpeg";

    // ✅ Analyze image (objects, colors, OCR)
    const { objects, colors, ocrText } = await analyzeImage(buffer, mimeType);

    // ✅ Merge tags
    const tags = [...new Set([...objects, ...colors])];
    const uploadRes = await cloudinary.v2.uploader.upload(image.url, { folder: "pins" });

    // ✅ Save pin to MongoDB
    const newPin = new Pin({
      title: title || "Untitled",
      pin,
      owner: req.user?._id || "guest", // fallback for testing
      image: { url: uploadRes.secure_url, id: uploadRes.public_id },
      objects,
      colors,
      ocrText,
      tags,
    });

    await newPin.save();
    console.log("✅ Pin saved:", newPin._id);

    return res.status(201).json({ message: "Pin saved successfully", pin: newPin });
  } catch (err) {
    console.error("❌ savePin error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Duplicate pin detected" });
    }
    return res.status(500).json({ error: "Server error while saving pin" });
  }
};
