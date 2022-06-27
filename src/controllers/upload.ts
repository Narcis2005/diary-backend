import { Request, Response } from "express";
import fs from "fs";
import multer, { FileFilterCallback } from 'multer';
// https://stackoverflow.com/questions/45154069/display-uploaded-image-with-multer

const storage = multer.diskStorage({
    destination: "static/images",
    filename: function (req, file, cb) {
        let filename = Date.now().toString();
        switch (file.mimetype) {
            case "image/png":
                filename = filename + ".png";
                break;
            case "image/jpeg":
                filename = filename + ".jpeg";
                break;
            case "image/jpg":
            filename = filename + ".jpgg";
            break;
            default:
                break;
        }
        cb(null, filename);
    },
   
});
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    let isValid = false;
    switch (file.mimetype) {
      case "image/png":
          isValid = true;
          break;
      case "image/jpeg":
          isValid = true;
          break;
      case "image/jpg":
          isValid = true;
      break;
      default:
          break;
  }
    const error = isValid ? null : new Error('Invalid mime type!');
    if (error) {
      return cb(error);
    }
        cb( null, isValid);
  };
const upload = multer({ storage,  fileFilter, limits:{fileSize: 5242880}}).single("file");

export const Upload = (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(400).send({ message: "Your file must be an image with the size lower than 5mb" });
            return;

        } else if (err) {
            res.status(500).send({message: "Your file must be an image with the size lower than 5mb. If this is the case, this might be a server issue"});
            return;
        }
        if (req.file) {

            const formData = req.file;
            if (req.user.imagePath !== "static/images/profilePlaceholder.png") {
                fs.unlinkSync(req.user.imagePath);
            }
            res.send(formData.filename);
            return;
        }
        res.sendStatus(400);
    });

};
