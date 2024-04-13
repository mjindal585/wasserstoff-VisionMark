import multer = require('multer');
import * as fs from 'node:fs';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const path = "/Users/mohitjindal/Desktop/images/raw";
      fs.mkdirSync(path, { recursive: true })
      return cb(null, path)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname )
    }
  })
  
export const upload = multer({ 
    storage, 
    fileFilter: function (req, file, cb) {
      if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
           req.fileValidationError = "Forbidden file extension";
           return cb(null, false, req.fileValidationError);
     }
     cb(null, true);
 }
})