const {envs}=require("../config/env.config")
const jwt = require("jsonwebtoken");

const SECRET = envs.SECRET || "branqui";
const SECRET_CONFIRM_ACOUNT=envs.SECRET_CONFIRM_ACOUNT || "gatota";

//token para persistencia login
const generateToken = (payload) => {
  const token = jwt.sign(payload, SECRET, { expiresIn: "24h" });
  return token;
};
//validacion de token logueo
function validateToken(token) {
  const payload = jwt.verify(token, SECRET);
  const user = {
    id: payload.id,
    email: payload.email,
    name:payload.name,
    lastname:payload.lastname,
    role:payload.role,
    exp:payload.exp
  };
  return user;
}
//token confirmación de cuenta creada
const generateTokenConfirmAcount = (payload) => {
  const token = jwt.sign(payload, SECRET_CONFIRM_ACOUNT, { expiresIn: "2h" });
  return token;
};


function validateTokenConfirmAcoubt(token) {
  const payload = jwt.verify(token, SECRET_CONFIRM_ACOUNT);
  const user = {
    id: payload.id,
    email: payload.email,
  };
  return user;
}





module.exports = { generateToken, validateToken,generateTokenConfirmAcount,validateTokenConfirmAcoubt };
