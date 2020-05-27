const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const Usuario = require("../models/usuario");

const Producto = require("../models/producto");

const fs = require("fs");

const path = require("path");

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put("/upload/:tipo/:id", function (req, res) {
  let tipo = req.params.tipo;

  let id = req.params.id;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No files were uploaded.",
      },
    });
  }

  //valida tipo

  let tiposValidos = ["productos", "usuarios"];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "El tipo no es valido, solo tipos " + tiposValidos.join(", "),
        tipo: tipo,
      },
    });
  }

  let archivo = req.files.archivo;

  // Extensiones permitidas
  let extensionesValidas = ["png", "jpg", "gif"];

  let nombreCortado = archivo.name.split(".");

  let extension = nombreCortado[nombreCortado.length - 1];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          "La extensión no es valida, solo archivos " +
          extensionesValidas.join(", "),
        ext: extension,
      },
    });
  }

  //Cambiar nombre al archivo

  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    // Aquí la imagen ya se cargo.
    switch (tipo) {
      case "usuarios":
        imagenUsuario(id, res, nombreArchivo);
        break;

      case "productos":
        imagenProducto(id, res, nombreArchivo);
        break;
    }
  });
});

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borraArchivo(nombreArchivo, "productos");
      res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      borraArchivo(nombreArchivo, "productos");
      if (err) {
        res.status(400).json({
          ok: false,
          err: {
            message: "El producto no existe",
          },
        });
      }
    }

    borraArchivo(productoDB.img, "productos");

    productoDB.img = nombreArchivo;

    productoDB.save((err, productoGuardado) => {
      if (err) {
        res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: productoGuardado,
        img: nombreArchivo,
      });
    });
  });
}

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borraArchivo(nombreArchivo, "usuarios");
      res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      borraArchivo(nombreArchivo, "usuarios");
      if (err) {
        res.status(400).json({
          ok: false,
          err: {
            message: "El usuario no existe",
          },
        });
      }
    }

    borraArchivo(usuarioDB.img, "usuarios");

    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioGuardado) => {
      if (err) {
        res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo,
      });
    });
  });
}

function borraArchivo(nombreImagen, tipo) {
  let pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImagen}`
  );

  //   let pathImagen = path.resolve(
  //     __dirname,
  //     `../../uploads/${tipo}/${usuarioDB.img}`
  //   );

  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;
