import User from "../models/user";
import jwt from "jsonwebtoken";
export const createTokens = async (user: User, secret: string, secret2: string) => {
    const createToken = jwt.sign(
        {
            user: { id: user.id },
        },
        secret,
        {
            expiresIn: "1m",
        },
    );

    const createRefreshToken = jwt.sign(
        {
            user: { id: user.id },
        },
        secret2,
        {
            expiresIn: "7d",
        },
    );

    return Promise.all([createToken, createRefreshToken]);
};
export interface IJWTDecode {
    user: {
        id: number;
    };
}
export const refreshTokens = async (refreshToken: string, SECRET: string, SECRET_2: string) => {
    let userId = -1;

    try {
        const {
            user: { id },
        } = jwt.decode(refreshToken) as IJWTDecode;
        userId = id;
    } catch (err) {
        return {};
    }

    if (!userId) {
        return {};
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
        return {};
    }

    const refreshSecret = SECRET_2 + user.password;

    try {
        jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
        return {};
    }

    const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret);
    return {
        token: newToken,
        refreshToken: newRefreshToken,
        user,
    };
};
