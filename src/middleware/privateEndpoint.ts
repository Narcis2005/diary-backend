import { NextFunction, Request, Response } from "express";

const privateEndpoint = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.id) {
        res.status(403).send({ message: "Please login in order to acces this" });
        return;
    }
    next();
};

export default privateEndpoint;
