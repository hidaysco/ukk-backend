import multer from 'multer';
import path from "path";
const pathPublic = path.resolve('public')

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        cb(null, pathPublic)
      },
      filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
      }
})

export const upload = multer({ storage })