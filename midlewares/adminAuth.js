const { validateToken, generateToken } = require("../config/token");
const { cookiesSettings } = require("../config/cookies.settings");

function validateAdminAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  // Validar el token
  const user = validateToken(token);

  if (!user || user.role !=="admin") {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  // Agregar usuario al request
  req.user = user;

 

  // Verificar si el token está próximo a expirar (por ejemplo, menos de 5 minutos)
  const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
  const timeLeft = user.exp - currentTime; // Tiempo restante hasta la expiración

  if (timeLeft < 60 * 60) {
    // Si el token está próximo a expirar, generamos uno nuevo
    const newToken = generateToken({
      email: user.email,
      id: user.id,
      name: user.name,
      lastname: user.lastname,
    });

    // Actualizamos la cookie con el nuevo token
    res.cookie("token", newToken, cookiesSettings);
  }

  next();
}

module.exports = { validateAdminAuth };
