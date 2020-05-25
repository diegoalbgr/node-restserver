const express = require("express");

const Categoria = require("../models/categoria.js");

const _ = require("underscore");

const {
  verificaToken,
  verificaAdminRole,
} = require("../middelwares/autenticacion.js");

const app = express();

/*=============================================
=        Mostrar todas las categorias         =
=============================================*/

app.get("/categoria", verificaToken, (req, res) => {
  let desde = req.query.desde || 0;

  desde = Number(desde);

  let limite = req.query.limite || 5;

  limite = Number(limite);

  Categoria.find()
    .populate("usuario", "nombre email")
    //otro esquema ademas del usuario.populate("usuario", "nombre email")
    .sort("descripcion")
    .skip(desde)
    .limit(limite)
    .exec((err, categorias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Categoria.count({}, (err, conteo) => {
        res.json({
          ok: true,
          categorias,
          cuantos: conteo,
        });
      });
    });
});

/*=============================================
=        Mostrar una categoria por ID         =
=============================================*/
app.get("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
});

/*=============================================
=         Crear una nueva categoria           =
=============================================*/

app.post("/categoria", verificaToken, (req, res) => {
  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id,
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: categoriaDB,
    });
  });
});

/*=============================================
=          Modificar una categoría            =
=============================================*/
app.put("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  let descripcion = req.body.descripcion;

  Categoria.findByIdAndUpdate(
    id,
    { descripcion },
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        usuario: categoriaDB,
      });
    }
  );
});

app.delete("/categoria/:id", [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;

  Categoria.findOneAndRemove(id, (err, categoriaBorrada) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!categoriaBorrada) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Categoria no encontrada",
        },
      });
    }

    res.json({
      ok: true,
      categoria: categoriaBorrada,
    });
  });
});

module.exports = app;
