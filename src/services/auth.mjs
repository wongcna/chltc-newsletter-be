import { appError } from "../middleware/globalErrorHandler.mjs";

export const login = async (req, res, next) => {
    try {
        return res.json({ data: {}, message: 'login successfully!' })
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