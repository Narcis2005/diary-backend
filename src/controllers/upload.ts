import { Request, Response } from "express";
import fs from "fs";
export const Upload = (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //add resize and compression
    if (req.file) {
        if (!req.file.mimetype.startsWith("image/") || req.file.size >= 5242880) {
            res.status(400).send({ message: "Your file must be an image with the size lower than 5mb" });
            return;
        }
        const formData = req.file;
        if (req.user.imagePath !== "static/images/profilePlaceholder.png") {
            fs.unlinkSync(req.user.imagePath);
        }
        res.send(formData.filename);
        return;
    }
    res.sendStatus(400);
};
