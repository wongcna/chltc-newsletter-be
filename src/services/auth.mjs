import { appError } from "../middleware/globalErrorHandler.mjs";
import { comparePassword } from "../utils/index.mjs";
import { generateToken } from "../utils/token.mjs";

export const login = async (req, res, next) => {
    try {
        const { email = '', password = '' } = req.body;
        // const userFound = {};

        // const isPasswordMatch = userFound ? (await comparePassword(password, userFound?.password ?? '')) : false;

        // if (!userFound || !isPasswordMatch) {
        //     return next(appError('invalid credentials!', 403))
        // }

        // const user = {
        //     firstName: userFound.firstName,
        //     lastName: userFound.lastName,
        //     email,
        //     token: generateToken(userFound._id)
        // }

        const data = { _id: 123, email, role: 'admin', isAdmin: true }
        return res.json({ data, message: 'user login successfully!' })
    } catch (error) {
        next(appError(error.message))
    }
};

export const logout = async (req, res, next) => {
    try {
        return res.json({ data: {}, message: 'logout successfully!' })
    } catch (error) {
        next(appError(error.message))
    }
};