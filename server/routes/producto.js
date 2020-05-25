const express = require("express");

const Producto = require("../models/producto.js");

const _ = require("underscore");

const { verificaToken } = require("../middelwares/autenticacion.js");

const app = express();

/*=============================================
=        Obtener todos los productos          =
=============================================*/

app.get("/producto", verificaToken, (req, res) => {
  //Trae todos los productos.
  //Populate: usuario y categoria.
  //Paginado

  let desde = req.query.desde || 0;

  desde = Number(desde);

  let limite = req.query.limite || 5;

  limite = Number(limite);

  Producto.find({ disponible: true })
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .skip(desde)
    .limit(limite)
    .exec((err, productos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Producto.count({}, (err, conteo) => {
        res.json({
          ok: true,
          productos,
          cuantos: conteo,
        });
      });
    });
});

/*=============================================
=          Obtener producto por ID            =
=============================================*/
app.get("/producto/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

/*=============================================
=             Buscar productos                =
=============================================*/

app.get("/producto/buscar/:termino", verificaToken, (req, res) => {
  let termino = req.params.termino;

  let regex = new RegExp(termino, "i");

  Producto.find({ descripcion: regex, disponible: true })
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

/*=============================================
=          Crear un nuevo producto            =
=============================================*/
app.post("/producto", verificaToken, (req, res) => {
  let body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precio,
    descripcion: body.descripcion,
    disponible: true,
    categoria: body.categoriaID,
    usuario: req.usuario._id,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

/*=============================================
=          Actualizar un producto            =
=============================================*/
app.put("/producto/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  let body = _.pick(req.body, [
    "nombre",
    "precioUni",
    "descripcion",
    "categoria",
  ]);

  Producto.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, productoDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        producto: productoDB,
      });
    }
  );
});

/*=============================================
=          Borrar un producto            =
=============================================*/
app.delete("/producto/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  let cambiaEstado = {
    disponible: false,
  };

  Producto.findByIdAndUpdate(
    id,
    cambiaEstado,
    { new: true },
    (err, productoBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      if (!productoBorrado) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Producto no encontrado",
          },
        });
      }

      res.json({
        ok: true,
        usuario: productoBorrado,
        mensaje: "Producto borrado",
      });
    }
  );
});

module.exports = app;
