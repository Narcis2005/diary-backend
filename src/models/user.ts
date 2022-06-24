import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import database from "../config/database";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare email: string;
    declare username: string;
    declare password: string;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare fullName: string;
    declare imagePath: string;
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

export default User;
