const { validateToken } = require("../config/token");

function validateAuth(req, res, next) {
  const token = req.cookies.token;


  if (!token) {
    return res.status(401).json({
      "error": "Unauthorized"
    })
  }

  const user = validateToken(token);

  if (!user) {
    return res.status(401).json({
      "error": "Unauthorized"
    })
  }

  req.user = user;

  next();
}

module.exports = {validateAuth};