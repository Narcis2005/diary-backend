/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from "express";
import fs from "fs";
import multer, { FileFilterCallback } from 'multer';
import sharp from "sharp";
// https://stackoverflow.com/questions/45154069/display-uploaded-image-with-multer

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//     filename: function (req, file, cb) {
//         let filename = Date.now().toString();
//         switch (file.mimetype) {
//             case "image/png":
//                 filename = filename + ".png";
//                 break;
//             case "image/jpeg":
//                 filename = filename + ".jpeg";
//                 break;
//             case "image/jpg":
//             filename = filename + ".jpgg";
//             break;
//             default:
//                 break;
//         }
//         cb(null, filename);
//     },
   
// });
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            sharp(req.file.buffer)
            .resize({
                width: 600,
                height: 600,
                fit: sharp.fit.cover,
                withoutEnlargement: true,
                position: sharp.strategy.entropy
              })
                .toBuffer()
                .then(newBuffer => {
                let erroWriting: Error|null = null;
        const fileName  =  Date.now().toString() + ".webp";

                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    if (req.user.imagePath !== "static/images/profilePlaceholder.png") {
                        fs.unlinkSync(req.user.imagePath);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    fs.writeFile("static/images/" +  fileName, newBuffer, "binary", (error) => {
                        erroWriting = error;
                        });
                        if (!erroWriting) {
                            res.send(fileName);
                           return;
                       }
                       if(erroWriting) {
                           // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                           res.status(400).send({message: err});
                           return;
                       }
                });

        }
    });

};
