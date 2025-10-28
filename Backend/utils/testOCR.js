import Tesseract from "tesseract.js";
const runOCR = async (imagePath) => {
  try {
    const { data } = await Tesseract.recognize(imagePath, "eng");
    console.log("OCR Text:", data.text);
  } catch (err) {
    console.error("OCR Error:", err);
  }
};

// Path to your image
runOCR("/home/madrix/Pinterest clone/Backend/uploads/f1.jpeg");

