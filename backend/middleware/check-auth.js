const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      'very_long_secret_for_development12312');
    req.userData = {email: decodedToken.email, userId: decodedToken.userId },
    next();
  } catch (error) {
    res.status(401).json({
      message: 'You are not authenticated!',
      error: error
    });
  }

};
