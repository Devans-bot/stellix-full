import { Pin } from "../models/pinmodels.js";
import getdataurl from "../utils/urlgenerator.js";
import mongoose from "mongoose";
import { User } from "../models/usermodel.js";
import multer from "multer";
import cloudinary  from "cloudinary";
import { analyzeImage } from "../utils/analyzeImages.js";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const extractWords = (text = "") =>
  text
    .toLowerCase()
    .split(/[\s,.;:!?()"'`]+/)
    .filter((w) => w.length > 2 && !stopwords.has(w));

export const createpin = async (req, res) => {
  try {
    const { title, pin } = req.body;
    if (!title || !pin) return res.status(400).json({ error: "Title and pin are required" });
    if (!req.file) return res.status(400).json({ error: "Image file is required" });

    // Convert buffer to Data URI
    const fileUri = getdataurl(req.file);

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.v2.uploader.upload(fileUri.content, { folder: "pins" });

    // Analyze image: objects, colors, OCR
    const { objects, colors} = await analyzeImage(req.file.buffer);

    // 🔹 Extract keywords from title + pin (description)
    const titleWords = extractWords(title);
    const descWords = extractWords(pin);

    // 🔹 Merge all tags (remove duplicates)
    const tags = [...new Set([...objects, ...colors, ...titleWords, ...descWords])];

    // Save new pin
    const newPin = new Pin({
      title,
      pin,
      owner: req.user._id,
      image: { id: uploadResult.public_id, url: uploadResult.secure_url },
      objects,
      colors,
      tags,
    });

    await newPin.save();

    return res.status(201).json({ message: "Pin created successfully", pin: newPin });
  } catch (err) {
    console.error("createpin error:", err);
    return res.status(500).json({ error: "Server error while creating pin" });
  }
};



const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const stopwords = new Set(["a","an","the","is","in","to","of","and","for","on","at","by"]);

export const searchpins = async (req, res) => {
  try {
    const {
      query = "",
      mode = "strict",   // "strict" = all words must match; "loose" = any word
      page = 1,
      limit = 20,
      sort = "-createdAt",
    } = req.body;

    // 🔹 Clean + tokenize query
    const keywords = query
      .toString()
      .trim()
      .split(/[\s,]+/)
      .map((kw) => kw.toLowerCase())
      .filter((kw) => kw.length > 2 && !stopwords.has(kw));

    if (keywords.length === 0)
      return res.status(200).json({ total: 0, results: [] });

    // 🔹 Build search conditions across multiple fields
    const regexConditions = keywords.map((kw) => {
      const safe = escapeRegex(kw);
      const regex = new RegExp(safe, "i"); // case-insensitive
      return [
        { title: regex },
        { pin: regex },
        { tags: regex },
        { objects: regex },
        { colors: regex },
      ];
    });

    // 🔹 Mode logic: "strict" = must match all words, "loose" = match any
    const filter =
      mode === "loose"
        ? { $or: regexConditions.flat() }
        : { $and: regexConditions.map((conds) => ({ $or: conds })) };

    const skip = (Math.max(1, page) - 1) * limit;

    // 🔹 Query DB
    const [total, pins] = await Promise.all([
      Pin.countDocuments(filter),
      Pin.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
    ]);

    // 🔹 Respond
    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      mode,
      results: pins,
    });
  } catch (err) {
    console.error("searchpins error:", err);
    return res.status(500).json({ error: "Server error during search" });
  }
};
















 function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const getAllpins = async (req, res) => {
  try {
    // get pins sorted by image size descending (replace `imageSize` with your field)
    const pins = await Pin.find().sort({ imageSize: -1 });

    // shuffle the sorted pins array randomly
    shuffleArray(pins);

    res.json(pins);
  } catch (error) {
    console.log("Error fetching pins:", error);
    res.status(500).json({ error: "Server error" });
  }
};



export const singlepin = async (req, res) => {
  try {
      const { id } = req.params;

      // Check if id exists
      if (!id) return res.status(400).json({ error: "Pin ID is required" });

      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid Pin ID" });
      }

      const pin = await Pin.findById(id).populate("owner", "-password");

      if (!pin) return res.status(404).json({ error: "Pin not found" });

      res.json(pin);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
  }
};


export const deletepin=async(req,res)=>{
  const pin=await Pin.findById(req.params.id)

if(!pin)return res.status(455).json({
  message:"no pin with this id"
})

if(pin.owner.toString()!==req.user._id.toString())return res.json({
  message:"You are not owner of this pin"
})

await cloudinary.v2.uploader.destroy(pin.image.id)

await pin.deleteOne()

res.json({
  message:"Pin deleted"
})
}

export const updatepin=async(req,res)=>{
    const pin=await Pin.findById(req.params.id)

    if(!pin)return res.status(455).json({
      message:"no pin with this id"
    })
  
    if(pin.owner.toString()!==req.user._id.toString())return res.json({
      message:"You are not owner of this pin"
    })

    
    pin.title=req.body.title,
    pin.pin=req.body.pin

    await pin.save()

    res.json({
        message:"Pin updated !"
    })
}



export const likes=async(req,res)=>{
  try {
    const pin = await Pin.findById(req.params.id);
    const loggedinuser= req.user._id
    
    if(!pin) return res.status(404).json({message:"Pin not found"})
    
    if(pin.owner._id.toString()===loggedinuser._id.toString())  
      return res.status(403).json({
      message:"U cant like ur own post urself"
  })

  const index=pin.likes.indexOf(loggedinuser)

  if(index===-1){
    pin.likes.push(loggedinuser)
  }else{
    pin.likes.splice(index,1)
  }

  await pin.save()

  res.status(200).json({
    msg:"like togled",
    likescount:pin.likes.length,
    liked:index===-1,
  })

  } catch (error) {
    console.log((error))
  }
}
export const getmypins= async (req, res) => {
  try {
    console.log("Current User ID:", req.user._id); // debug

    const pins = await Pin.find({ owner: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json(pins);
  } catch (error) {
    console.error("Error fetching user pins:", error);
    res.status(500).json({ message: "Server error, could not fetch pins" });
  }
};


export const getFollowingPins = async (req, res) => {
  try {
    const userId = req.user._id // assuming user is authenticated
    const user = await User.findById(userId).populate("following")

    const followingIds = user.following.map((f) => f._id)

    const pins = await Pin.find({ owner: { $in: followingIds } })
      .populate("owner", "username profilePic")
      .sort({ createdAt: -1 })

    res.json(pins)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error fetching following pins" })
  }
}

export const relatedpins = async (req, res) => {
  try {
    const { pinId } = req.body;

    // 1️⃣ Find the current pin
    const currentPin = await Pin.findById(pinId);
    if (!currentPin) return res.status(404).json({ error: "Pin not found" });

    // 2️⃣ Take only objects as tags
    const objects = currentPin.objects || [];
    if (objects.length === 0) return res.status(200).json({ total: 0, results: [] });

    // 3️⃣ Build regex conditions for OR search
    const regexConditions = objects.map(obj => {
      const safe = obj.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex special chars
      return { objects: { $regex: safe, $options: "i" } };
    });

    // 4️⃣ Find related pins excluding current pin
    const relatedPins = await Pin.find({
      _id: { $ne: currentPin._id },
      $or: regexConditions,
    })
      .limit(10)
      .sort({ createdAt: -1 });

    res.json({ total: relatedPins.length, results: relatedPins });
  } catch (error) {
    console.error("relatedpins error:", error);
    res.status(500).json({ error: "Error fetching related pins" });
  }
};
