import { Request, Response } from "express";
import User from "../models/user";

export const getDiary = async (req: Request, res: Response) => {
    const user = await User.findByPk(req.user.id);
    res.send(await user.getDiaryEntries());
};

export const updateDiary = async (req: Request, res: Response) => {
    interface IEntry {
        id: number;
        content: string;
        date: Date;
        isNewEntry: boolean;
    }
    const entries = req.body.entries as IEntry[];
    const user = await User.findByPk(req.user.id);
    const diaryEntries = await user.getDiaryEntries();
    const areEntriesValid = await user.hasDiaryEntries(entries.map((entry) => entry.id));
    if (!areEntriesValid) {
        res.send({ message: "You dont own every entry" });
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    entries.forEach(async (entry) => {
        if (!entry.isNewEntry) {
            const diaryEntry = diaryEntries.filter((e) => (e.id = entry.id));
            diaryEntry[0].content = entry.content;
            await diaryEntry[0].save();
        } else {
            await user.createDiaryEntry({
                content: entry.content,
                createdAt: entry.date,
                updatedAt: entry.date,
            });
        }
    });
    res.send({ message: "journal updated succesfully" });
};
