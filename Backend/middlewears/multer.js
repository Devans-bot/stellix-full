// import multer from 'multer'

// const storage= multer.memoryStorage()

// const uploadfile= multer({storage}).single("file")

// export default uploadfile


import multer from "multer";

const storage = multer.memoryStorage();
const uploadFile = multer({ storage }).single("file");

export default uploadFile;
