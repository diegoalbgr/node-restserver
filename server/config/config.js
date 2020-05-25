// =================================
//  Puerto
// =================================

process.env.PORT = process.env.PORT || 3000;

// =================================
//  Entorno
// =================================

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// =================================
//  Vencimiento del token
// =================================

process.env.CADUCIDAD_TOKEN = "48h";

// =================================
//  SEED de autenticación
// =================================

process.env.SEED = process.env.SEED || "este-es-el-seed-de-desarrollo";

// =================================
//  Base de datos
// =================================

let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// =================================
//  Google client ID
// =================================

process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "191061991826-vnts0jh4om8h68ck8181757vd4ptbtgu.apps.googleusercontent.com";

//191061991826-vfb4uekrjht3nopivibnscp3l6d58995.apps.googleusercontent.com
//"Not a valid origin for the client: https://hidden-falls-33317.herokuapp.com has not been whitelisted for client ID 191061991826-vfb4uekrjht3nopivibnscp3l6d58995.apps.googleusercontent.com. Please go to https://console.developers.google.com/ and whitelist this origin for your project's client ID."
