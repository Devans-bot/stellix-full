import * as tf from "@tensorflow/tfjs-node";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import getColors from "get-image-colors";
import nearestColor from "nearest-color";
import Tesseract from "tesseract.js";

// 🎨 Map hex colors to nearest basic color name
const basicPalette = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  yellow: "#FFFF00",
  black: "#000000",
  white: "#FFFFFF",
  orange: "#FFA500",
  purple: "#800080",
  pink: "#FFC0CB",
  brown: "#A52A2A",
  gray: "#808080",
};
const findClosestColorName = nearestColor.from(basicPalette);

export async function analyzeImage(buffer, mimeType = "image/jpeg") {
  // 1️⃣ Detect dominant colors
  let colors = [];
  try {
    const palette = await getColors(buffer, mimeType);
    const hexColors = palette.map(c => c.hex());
    // convert hex → closest basic color name
    colors = [...new Set(hexColors.map(hex => findClosestColorName(hex).name))];
  } catch (err) {
    console.error("Color extraction failed:", err.message);
  }

  // 2️⃣ Object detection
  let objects = [];
  try {
    const model = await cocoSsd.load();
    const tensor = tf.node.decodeImage(buffer);
    const predictions = await model.detect(tensor);
    objects = predictions.map(p => p.class);
    tensor.dispose();
  } catch (err) {
    console.error("Object detection failed:", err.message);
  }

  // 3️⃣ OCR text
  let ocrText = "";
  try {
    const { data: { text } } = await Tesseract.recognize(buffer, "eng");
    ocrText = text.trim();
  } catch (err) {
    console.error("OCR failed:", err.message);
  }

  return { colors, objects, ocrText };
}
