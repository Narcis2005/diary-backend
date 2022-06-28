import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import database from "../config/database";
import User from "./user";

class DiaryEntry extends Model<InferAttributes<DiaryEntry>, InferCreationAttributes<DiaryEntry>> {
    declare id: CreationOptional<number>;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare content: string;
    declare userId: ForeignKey<User["id"]>;
}

DiaryEntry.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        content: {
            type: new DataTypes.STRING(),
            allowNull: true,
        },
    },
    {
        tableName: "diaryEntries",
        sequelize: database,
    },
);

export default DiaryEntry;
