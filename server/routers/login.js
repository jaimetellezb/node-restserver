const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuario");

const app = express();

app.post("/login", (req, res) => {
    let body = req.body;

    Usuario.findOne({
            email: body.email,
        },
        (err, usuarioDB) => {
            console.log("USERBD", !usuarioDB);
            console.log("ERR", err);
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Usuario* o contraseña incorrectos",
                    },
                });
            }
            // contraseña a evaluar
            // contra la de BD
            if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Usuario o contraseña* incorrectos",
                    },
                });
            }
            let token = jwt.sign({
                    usuario: usuarioDB,
                },
                process.env.SEED, { expiresIn: process.env.EXPIRATION_TOKEN }
            ); // expira en 30 días

            res.json({
                ok: true,
                usuario: usuarioDB,
                token,
            });
        }
    );
});

module.exports = app;