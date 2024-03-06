import jwt from "jsonwebtoken";

process.env.PORT;

const secretKey = "Usmaan123"; // Ensure you have a secret key

export const authenticateJWT = (req, res, next) => {
  // Fixed typo here: It should be `req.headers` instead of `req.header`
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Assuming your token is formatted as "Bearer <token>"
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        // Correctly send a response when the token is invalid or expired
        // It's better to chain .sendStatus with .json in separate calls
        // .sendStatus(403) will actually send the response, making .json() unreachable
        // Therefore, use .status(403) instead of .sendStatus(403) when you intend to use .json() afterwards
        return res.status(403).json({
          message: "Error in verifying token",
        }); // Forbidden access
      }

      // If verification is successful, attach the decoded user to the request object
      req.user = user;

      // Proceed to the next middleware or the request handler
      next();
    });
  } else {
    // If there's no token, prevent access to the route
    // Fixed this part to correctly chain the methods
    res.status(401).json({
      // Use .status(401) when you want to follow it with .json()
      message: "Unauthorized",
    }); // Unauthorized access
  }
};
