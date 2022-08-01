/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Request, Response } from "express";
import User from "../models/user";
export const getDiary = async (req: Request, res: Response) => {
    const user = await User.findByPk(req.user.id);
    const userEntries = await user.getDiaryEntries({order: ["createdAt"]});
    const decryptedEntries = userEntries.map((entry) => ({
        id: entry.id,
        updatedAt: entry.updatedAt,
        createdAt: entry.createdAt,
        userId: entry.userId,
        content: decryptContent({ content: entry.content, id: user.id.toString(), secret: process.env.DIARY_SECRET }),
    }));
    res.send(decryptedEntries);
};
import htmlToPdf from "convert-html-to-pdf";
import { Readable } from "stream";
import crypto from "crypto";
interface IEncryptContent {
    content: string;
    id: string;
    secret: string;
}

export const encryptContent = ({ content, id, secret }: IEncryptContent): string => {
    const iv = crypto.randomBytes(16);
    const password = (id + secret).substring(0, 32);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(password), iv);
    let encrypted = cipher.update(content);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decryptContent = ({ content, id, secret }: IEncryptContent): string => {
    const textParts = content.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const password = (id + secret).substring(0, 32);
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(password), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
export const updateDiary = async (req: Request, res: Response) => {
    interface IEntry {
        data: Date;
        id: number;
        content: string;
        date: Date;
        isNewEntry: boolean;
    }
    const entries = req.body.entries as IEntry[];
    const user = await User.findByPk(req.user.id);
    const diaryEntries = await user.getDiaryEntries();
    const areEntriesValid = await user.hasDiaryEntries(entries.filter(entry => !entry.isNewEntry).map((entry) => entry.id));
    if (!areEntriesValid) {
        res.send({ message: "You dont own all entries" });
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    entries.forEach(async (entry) => {
        if (!entry.isNewEntry) {

            const diaryEntry = diaryEntries.filter((e) => (e.id == entry.id));
            diaryEntry[0].content = encryptContent({
                content: entry.content,
                id: user.id.toString(),
                secret: process.env.DIARY_SECRET,
            });
            diaryEntry[0].updatedAt = new Date();
            await diaryEntry[0].save();
        } else {
            await user.createDiaryEntry({
                content: encryptContent({
                    content: entry.content,
                    id: user.id.toString(),
                    secret: process.env.DIARY_SECRET,
                }),
                createdAt: entry.date,
                updatedAt: entry.date,
            });
        }
    });
    res.send({ message: "journal updated succesfully" });
};
interface IPageContent {
    content: string;
    id: number;
}
const formatStringsInSubstringsWithNWords = (string: string, n: number): IPageContent[] => {
    const stringsArray = string.split(" ");
    const stringsFormated = [];
    for (let i = 0; i < stringsArray.length; i += n) {
        let string = "";
        const length = stringsArray.length - i >= n ? i + n : stringsArray.length;
        for (let j = i; j < length; j++) {
            string += stringsArray[j] + " ";
        }
        stringsFormated.push({ content: string, id: i / n + 1 });
    }
    return stringsFormated;
};

export const Download = async (req: Request, res: Response) => {
    const user = await User.findByPk(req.user.id);
    const diaryEntries = await user.getDiaryEntries();
    const formatedDiaryEntries = diaryEntries.map((content) => {
        return {
            content: formatStringsInSubstringsWithNWords(
                decryptContent({ content: content.content, id: user.id.toString(), secret: process.env.DIARY_SECRET }),
                210,
            ),
            date: content.createdAt,
        };
    });
    let indexOfPage = 1;
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" } as const;
    const pages = formatedDiaryEntries.map((data) => {
        return data.content.map(
            (content) =>
                `<div class="page">
                <div class="header">
                    <p style="font-weight: 700;"> ${user.username}'s diary</p>
                    <p>${new Date(data.date).toLocaleDateString("en-US", options)}
                </div>
                <div class="content">
                ${content.content}
                </div>
                <div class="footer">
                    <p>${indexOfPage++} </p>
                </div>
            </div> `,
        );
    });
    const pagesjoined = pages.join("");
    const finalPages = pagesjoined.replaceAll(",", "");
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
            <style>
@import url('https://fonts.googleapis.com/css2?family=Caudex:wght@400;700&display=swap');
        * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-family: 'Caudex', serif;

    }
html, body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    height: 100%;
  }
  .page {
    position: relative;
    width: 90%;
    margin-left: 5%;
    padding-top: 5%;
    display: block;
    page-break-after: always;
    height: 94%;
    overflow: hidden;
    
  }
  .content {
    height: 91%;
    width: 100%;
    line-height: 40px;
    background: linear-gradient(to bottom, white 39px, rgb(160, 160, 160) 1px);
    background-size: 100% 40px;
    padding: 6px 20px;
    font-size: 1.3rem;
  }

  .container {
    margin:0;
    padding: 0;
    height: 100%;
  }
  .header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 23px;
    height: 5%;
  }
  .footer {
    display: flex;
    justify-content: center;
    padding: 10px 0;
    font-size: 25px;
  }
        </style>
            <meta charset="UTF-8">
    </head>
    <body>
    <div class="container">
        ${finalPages}
        </div>
    </body>
    </html>`;
    const htmlPdf = new htmlToPdf(html, {
        pdfOptions: {
            format: "A4",
        },
        waitForNetworkIdle: true,
    });
    htmlPdf
        .convert()
        .then((pdfBuffer) => {
            const stream = Readable.from(pdfBuffer);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "inline; filename=diary.pdf");
            stream.pipe(res);
        })
        .catch((err) => {
            console.log(err);
        });
};
