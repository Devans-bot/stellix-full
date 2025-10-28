import mongoose from "mongoose";

const pinSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },

  // ⚠️ removed unique:true (otherwise AI pins with same description will fail)
  pin: { type: String, required: true },

  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  image: {
    id: { type: String, default: null },   // Cloudinary public_id (optional)
    url: { type: String, required: true }, // always required
  },

  objects: [{ type: String, index: true }],
  colors:  [{ type: String, index: true }],
  tags:    [{ type: String, index: true }],

  likes:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
}, {
  timestamps: true,
});

// Text search across all meaningful fields
pinSchema.index(
  { title: "text", description: "text", ocrText: "text", tags: "text" },
  { weights: { title: 5, tags: 4, ocrText: 3, description: 1 }, name: "PinTextIndex" }
);

export const Pin = mongoose.model("Pin", pinSchema);
