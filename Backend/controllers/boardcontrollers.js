import { Board } from "../models/boards.js"
import mongoose from "mongoose"
import { Pin } from "../models/pinmodels.js"

export const newboard=async(req,res)=>{
    try {
        const {name}= req.body
        const user=req.user._id

        if(!name) return res.status(400).json({message:"Name is empty"})

        if(!user) return res.status(400).json({message:"user is empty"})

        const board=await Board.create({
            name,owner:user
        })

        await board.save()

        res.status(201).json({message:"Board created successfully",
          boardId:board._id
        })
    } catch (error) {
        console.log(error)
    }
}

export const singleboard=async(req,res)=>{
  try {
      const id=req.params.id
      const board=await Board.findById(id).populate("pins")
      res.json(board)
  } catch (error) {
      console.log(error)
  }
}

// Get all boards with 1 preview pin image

export const userboards = async (req, res) => {
  try {
    // get all boards for this user, with pins populated
    const boards = await Board.find({ owner: req.user._id })
                              .populate("pins"); // populate pins directly

    const boardsWithPreview = boards.map((board) => {
      // pick the first pin in the board as the preview
      const previewPin = board.pins.length > 0 ? board.pins[0] : null;

      return {
        _id: board._id,
        name: board.name,
        pinname: previewPin ? previewPin.title : null,
        previewImage: previewPin ? previewPin.image : null,
      };
    });

    res.json(boardsWithPreview);
  } catch (error) {
    console.error("Error fetching user boards:", error);
    res.status(500).json({ message: "Error fetching boards", error });
  }
};


export const addpintoboard=async(req,res)=>{
  try {

      const pin=req.params.id


       const {boardId}= req.body
       const board= await Board.findById(boardId)

       board.pins.push(
          pin
       )

       await board.save()
       res.json({message:`Pin added to ${board.name}`})
      
  } catch (error) {
      console.log(error)
  }
}

export const addpinstoboard = async (req, res) => {
  try {
    const { boardName, pinIds } = req.body;

    if (!boardName || !Array.isArray(pinIds) || pinIds.length === 0) {
      return res.status(400).json({ success: false, message: "Board name and an array of pin IDs are required" });
    }

    // Find the board by name
    const board = await Board.findOne({ name: boardName,owner:req.user._id });
    if (!board) {
      return res.status(404).json({ success: false, message: "Board not found" });
    }

    // Validate all pins exist
    const existingPins = await Pin.find({ _id: { $in: pinIds } });
    if (existingPins.length !== pinIds.length) {
      return res.status(404).json({ success: false, message: "One or more pins not found" });
    }

    // Filter out duplicates
    const newPins = pinIds.filter(pinId => !board.pins.includes(pinId));

    if (newPins.length === 0) {
      return res.status(400).json({ success: false, message: "All pins are already in the board" });
    }

    // Add new pins
    board.pins.push(...newPins);
    await board.save();

    const updatedBoard = await Board.findOne({ name: boardName }).populate("pins");

    return res.status(200).json({ success: true, message: "Pins added to board", board: updatedBoard });
  } catch (error) {
    console.error("Error adding pins to board:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const deleteboardpin=async(req,res)=>{
    try {
        const pin=req.params.id
         const user= req.user._id
         if(!pin)return res.status(404).json({message:"Please provide pin id"})

            
        const board=await Board.findOne({owner:user})
        if(!board)return res.status(404).json({message:"board not found"})
        
        const pinindex= board.pins.indexOf(pin)

        if(pinindex===-1){
        return res.status(404).json({message:"no pin found"})
        }

        board.pins.splice(pinindex,1)

        await board.save()

        res.json("pin deleted")
        
    } catch (error) {
        console.log(error)
    }
}

export const updatename = async (req, res) => {
    try {
      const board = await Board.findById(req.params.id);
      if (!board) return res.status(404).json({ message: "Board not found" });
  
      // Optional: verify owner
      if (board.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }
  
      const { title } = req.body;
      if (title) board.name = title;
      
      await board.save();
      res.json(board);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };


  
  export const deleteboard=async(req,res)=>{
    try {
        const boardid=req.params.id

         const board=await Board.findById(boardid)

       if((board.owner.toString())!==(req.user._id.toString())){
        return res.status(404).json({message:"You are not owner "})
       }

       await Board.findByIdAndDelete(boardid)

       res.json({message:"board deleted"})

    } catch (error) {
        console.log(error)
    }
  }
  export const relatedpinsinboard = async (req, res) => {
    try {
      const { name } = req.body; // user input keyword or sentence
      if (!name) return res.status(400).json({ message: "No name is given" });
  
      // Split sentence into keywords, remove short words
      const words = name
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 2); // ignore very short words
  
      if (words.length === 0) return res.status(200).json({ pins: [], message: "No valid keywords" });
  
      // Build regex array for tags OR fields
      const regexConditions = words.flatMap(word => {
        const safe = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(safe, "i");
        return [
          { tags: regex },
          { objects: regex },
          { colors: regex },
          { title: regex },
          { pin: regex },
          { description: regex }
        ];
      });
  
      // Find related pins
      const relatedPins = await Pin.find({ $or: regexConditions })
        .limit(30)
        .sort({ createdAt: -1 });
  
      if (!relatedPins.length) {
        return res.status(404).json({ message: "No pins found" });
      }
  
      res.status(200).json({
        pins: relatedPins,
        message: "Pins fetched successfully"
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  
  
  export const boardpins = async (req, res) => {
    try {
      const { id: boardId } = req.params;
  
      if (!boardId) {
        return res.status(400).json({ success: false, message: "Board ID is required" });
      }
  
      const board = await Board.findById(boardId).populate("pins");
  
      if (!board) {
        return res.status(404).json({ success: false, message: "Board not found" });
      }
  
      return res.status(200).json({
        success: true,
        message: "Pins fetched successfully",
        pins: board.pins,
      });
    } catch (error) {
      console.error("Error fetching board pins:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
  export const delteboardpins = async (req, res) => {
    try {
      const { pins, boardId } = req.body;
  
      if (!pins || !pins.length) {
        return res.status(400).json({ message: "Pins list is empty" });
      }
      if (!boardId) {
        return res.status(400).json({ message: "Board ID is required" });
      }
  
      const boardObjectId = new mongoose.Types.ObjectId(boardId);
  
      // 1️⃣ Remove boardId from each pin’s boards array
      await Pin.updateMany(
        { _id: { $in: pins } },
        { $pull: { boards: boardObjectId } }
      );
  
      // 2️⃣ Remove pins from the board’s pins array
      await Board.updateOne(
        { _id: boardObjectId },
        { $pull: { pins: { $in: pins } } }
      );
  
      res.status(202).json({ message: "Pins removed from board successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  