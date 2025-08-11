const jwt = require('jsonwebtoken');
const { TOKENS, MESSAGES } = require('../constants');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: MESSAGES.UNAUTHORIZED });
  }

  // Extract the token from header
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, TOKENS.JWT_SECRET);

    // Attach decoded payload to the request object
      req.user = {
       _id: decoded.userId,
        role: decoded.role,
    };

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails
    return res.status(401).json({ message: MESSAGES.UNAUTHORIZED });
  }
};

module.exports = authenticate;
