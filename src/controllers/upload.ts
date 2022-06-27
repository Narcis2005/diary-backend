import { Request, Response } from "express";
import fs from "fs";
export const Upload = (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (req.file) {
        const formData = req.file;
        if (req.user.imagePath !== "static/images/profilePlaceholder.png") {
            fs.unlinkSync(req.user.imagePath);
        }
        res.send(formData.filename);
        return;
    }
    res.sendStatus(400);
};
