import * as tf from "@tensorflow/tfjs-node";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import getColors from "get-image-colors";
import nearestColor from "nearest-color";
import Tesseract from "tesseract.js";

// 🎨 Basic color palette
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

// ✅ Cache COCO-SSD model globally
let cocoModel = null;
async function getCocoModel() {
  if (!cocoModel) {
    cocoModel = await cocoSsd.load();
    console.log("✅ COCO-SSD model loaded once.");
  }
  return cocoModel;
}

export async function analyzeImage(buffer, mimeType = "image/jpeg") {
  const cleanup = () => {
    try {
      tf.engine().startScope();
      tf.engine().endScope();
      if (global.gc) global.gc();
    } catch {}
  };

  // --- PARALLEL ANALYSIS ---
  const [colorRes, objectRes, ocrRes] = await Promise.allSettled([
    // 1️⃣ Dominant Colors
    (async () => {
      const palette = await getColors(buffer, mimeType);
      const hexColors = palette.map((c) => c.hex());
      return [...new Set(hexColors.map((hex) => findClosestColorName(hex).name))];
    })(),

    // 2️⃣ Object Detection (Fast Inference)
    (async () => {
      const model = await getCocoModel();
      const tensor = tf.node.decodeImage(buffer, 3);
      const resized = tf.image.resizeBilinear(tensor, [300, 300]);
      const predictions = await model.detect(resized);
      tensor.dispose();
      resized.dispose();
      return predictions.map((p) => p.class);
    })(),

    // 3️⃣ Adaptive OCR (only if text detected in model or small image)
    (async () => {
      // skip OCR if image is too big or memory is tight
      if (buffer.length > 2 * 1024 * 1024) return ""; // skip >2MB images
      const { data: { text } } = await Tesseract.recognize(buffer, "eng", {
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        tessedit_pageseg_mode: 6,
        logger: () => {},
      });
      return text.trim();
    })(),
  ]);

  const colors = colorRes.status === "fulfilled" ? colorRes.value : [];
  const objects = objectRes.status === "fulfilled" ? objectRes.value : [];
  const ocrText = ocrRes.status === "fulfilled" ? ocrRes.value : "";

  cleanup();
  return { colors, objects, ocrText };
}
