import { appError } from "../middleware/globalErrorHandler.mjs";
import { getHeadersToken, verifyToken } from "./token.mjs";

export const isLogin = (request, response, next) => {
  const token = getHeadersToken(request);
  const decodedUser = verifyToken(token);

  if (!decodedUser) {
    next(appError('Unauthorized', 401))
  } else {
    request.userAuth = decodedUser?.id;
    next();
  }
}