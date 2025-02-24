import { sql } from "../config/db.mjs";
import { appError } from "../middleware/globalErrorHandler.mjs";
import { comparePassword, handleHashPassword } from "../utils/index.mjs";
import { generateToken } from "../utils/token.mjs";

export const login = async (req, res, next) => {
  try {
    const { email = '', password = '' } = req.body;

    const query = `SELECT * FROM tblStaff WHERE username = @email`;
    const request = new sql.Request();
    request.input('email', sql.NVarChar, email);
    const result = await request.query(query);

    const userFound = result?.recordset?.[0];

    if (!userFound) {
      return next(appError('invalid credentials!', 403));
    }

    const isPasswordMatch = userFound ? (await comparePassword(password, userFound?.password ?? '')) : false;

    if (!userFound || !isPasswordMatch) {
      return next(appError('invalid credentials!', 403))
    }

    const user = {
      ...userFound,
      role: 'admin',
      isAdmin: true,
      token: generateToken(userFound._id)
    }
    console.log('user Logged in', user);
    return res.json({ data: user, message: 'user login successfully!' })
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