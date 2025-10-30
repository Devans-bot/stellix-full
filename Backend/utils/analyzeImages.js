import * as tf from "@tensorflow/tfjs-node";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import sharp from "sharp";
import getColors from "get-image-colors";
import nearestColor from "nearest-color";
import Tesseract from "tesseract.js";

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

// ✅ Cache COCO model in memory (load only once)
let cocoModel = null;
async function getModel() {
  if (!cocoModel) {
    cocoModel = await cocoSsd.load();
    console.log("✅ COCO-SSD model loaded once and cached");
  }
  return cocoModel;
}

export async function analyzeImage(buffer, mimeType = "image/jpeg") {
  try {
    // 🖼️ Resize to speed up analysis (max 600px)
    const resizedBuffer = await sharp(buffer)
      .resize(600, 600, { fit: "inside" })
      .toBuffer();

    // 🎨 Run color extraction and object detection in parallel
    const [colorResult, objectResult] = await Promise.allSettled([
      (async () => {
        const palette = await getColors(resizedBuffer, mimeType);
        const hexColors = palette.map(c => c.hex());
        return [...new Set(hexColors.map(hex => findClosestColorName(hex).name))];
      })(),
      (async () => {
        const model = await getModel();
        const tensor = tf.node.decodeImage(resizedBuffer);
        const predictions = await model.detect(tensor);
        tensor.dispose();
        return predictions.map(p => p.class);
      })(),
    ]);

    const colors = colorResult.value || [];
    const objects = objectResult.value || [];

    // 🔠 Run OCR only if image >100KB
    let ocrText = "";
    if (buffer.length > 100 * 1024) {
      try {
        const { data } = await Tesseract.recognize(resizedBuffer, "eng");
        ocrText = data.text.trim();
      } catch (e) {
        console.warn("OCR skipped/fallback:", e.message);
      }
    }

    return { colors, objects, ocrText };
  } catch (err) {
    console.error("❌ analyzeImage failed:", err);
    return { colors: [], objects: [], ocrText: "" };
  }
}
