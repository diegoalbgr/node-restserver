const jwt = require("jsonwebtoken");

//====================
// Verificar Token
//====================

//Este es un middleware, toda funcion en otro lado que la contenga pasara por aquí, pudiendo hacer verificaciones.
let verificaToken = (req, res, next) => {
  let token = req.get("token");

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no valido",
        },
      });
    }

    req.usuario = decoded.usuario;

    next(); //Da paso a la siguiente función.
  });
};

//====================
// Verificar AdminRole
//====================

let verificaAdminRole = (req, res, next) => {
  let token = req.get("token");

  if (!(req.usuario.role === "ADMIN_ROLE")) {
    return res.status(401).json({
      ok: false,
      err: {
        message: "No tienes los permisos para realizar esta acción.",
      },
    });
  }

  next(); //Da paso a la siguiente función.
};

module.exports = {
  verificaToken,
  verificaAdminRole,
};
