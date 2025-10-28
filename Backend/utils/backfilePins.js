// /Backend/database/backfilePins.js
import mongoose from "mongoose";
import fetch from "node-fetch";
import { Pin } from "../models/pinmodels.js";
import * as tf from "@tensorflow/tfjs-node";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import getColors from "get-image-colors";
import nearestColor from "nearest-color";
import dotenv from "dotenv"

dotenv.config()
// === Color palette ===
const palette = {
  blue: "#0000ff",
  red: "#ff0000",
  white: "#ffffff",
  black: "#000000",
  gray: "#808080",
  green: "#00ff00",
  yellow: "#ffff00",
};
const nearest = nearestColor.from(palette);

// === Load COCO-SSD model ===
let cocoModel = null;
const loadCoco = async () => {
  if (!cocoModel) cocoModel = await cocoSsd.load();
  return cocoModel;
};

// === Process image buffer ===
const processBuffer = async (buffer, mime) => {
  const model = await loadCoco();
  const tensor = tf.node.decodeImage(buffer, 3);
  const preds = await model.detect(tensor);
  tensor.dispose();

  const objects = Array.from(new Set(preds.map((p) => p.class.toLowerCase())));
  const cols = await getColors(buffer, { type: mime });
  const hexes = cols.map((c) => c.hex());
  const colors = Array.from(
    new Set(hexes.map((h) => nearest(h)?.name || h))
  );

  return { objects, colors };
};

// === Main function ===
const run = async () => {
  try {
    // Connect to MongoDB
     
            await mongoose.connect(process.env.MONGO_URL,{
                dbName:"pinterest"}
            )
            console.log("connected")

    // Find pins that need processing
    const pins = await Pin.find({
      $or: [{ objects: { $exists: false } }, { colors: { $exists: false } }],
    });
    console.log("Will process", pins.length, "pins");

    for (const p of pins) {
      try {
        if (!p.image?.url) continue;

        const res = await fetch(p.image.url);
        const buffer = Buffer.from(await res.arrayBuffer());
        const mime = res.headers.get("content-type") || "image/jpeg";

        const { objects, colors } = await processBuffer(buffer, mime);
        const tags = Array.from(new Set([...(p.tags || []), ...objects, ...colors]));

        p.objects = objects;
        p.colors = colors;
        p.tags = tags;

        await p.save();
        console.log("Updated pin:", p._id.toString());
      } catch (err) {
        console.error("Failed processing pin", p._id.toString(), err);
      }
    }
  } catch (err) {
    console.error("Error in run():", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// === Start script ===
run();
