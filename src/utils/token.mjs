import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: '1d' })
}

export const getHeadersToken = (request) => {
  return (request.headers['authorization']?.split(" ")[1]);
}

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
    if (error) {
      return false
    } else {
      return decoded
    }
  })
}