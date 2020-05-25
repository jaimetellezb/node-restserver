const express = require("express");
const app = express();

const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const _ = require("underscore");

app.get("/usuario", (req, res) => {
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);

    Usuario.find({ estado: true }, "nombre email role estado google")
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo,
                });
            });
        });
});

app.post("/usuario", async(req, res) => {
    let body = req.body;

    // Llenamos el objeto
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: await bcrypt.hash(body.password, 10).then((hash) => {
            return hash;
        }),
        role: body.role,
    });

    // otra forma
    // await bcrypt.hash(body.password, 10).then((hash) => {
    //     usuario.password = hash;
    // });

    //guardar en base de datos
    usuario.save((err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        //usuario.password = null;
        res.json({
            ok: true,
            usuario: usuarioBD,
        });
    });
});

app.put("/usuario/:id", (req, res) => {
    let id = req.params.id;
    //let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);
    let body = _.omit(req.body, "password", "google");

    Usuario.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, usuarioBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                usuario: usuarioBD,
            });
        }
    );
});

app.delete("/usuario/:id", (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(
        id, { estado: false }, { new: true },
        (err, usuarioBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                usuario: usuarioBD,
            });
        }
    );

    //Elimina de la base de datos
    // Usuario.findByIdAndRemove(id, (err, usuarioBD) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err,
    //         });
    //     }

    //     if (!usuarioBD) {
    //         return res.status(400).json({
    //             ok: false,
    //             message: "Usuario no encontrado",
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBD,
    //     });
    // });
});

module.exports = app;