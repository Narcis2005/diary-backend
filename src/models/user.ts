import {
    Association,
    CreationOptional,
    DataTypes,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import database from "../config/database";
import DiaryEntry from "./diaryEntry";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare email: string;
    declare username: string;
    declare password: string;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare fullName: string;
    declare imagePath: string;
    declare getDiaryEntries: HasManyGetAssociationsMixin<DiaryEntry>;
    declare hasDiaryEntry: HasManyHasAssociationMixin<DiaryEntry, number>;
    declare createDiaryEntry: HasManyCreateAssociationMixin<DiaryEntry, "userId">;
    declare hasDiaryEntries: HasManyHasAssociationsMixin<DiaryEntry, number>;
    declare static associations: {
        diaryEntries: Association<User, DiaryEntry>;
    };
}
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: new DataTypes.STRING(200),
            allowNull: false,
        },
        username: {
            type: new DataTypes.STRING(200),
            allowNull: true,
        },
        password: {
            type: new DataTypes.STRING(300),
            allowNull: true,
        },
        fullName: {
            type: new DataTypes.STRING(),
            allowNull: true,
        },
        imagePath: {
            type: new DataTypes.STRING(),
            allowNull: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        tableName: "users",
        sequelize: database,
    },
);
User.hasMany(DiaryEntry, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "diaryEntries",
});
export default User;
