const express = require("express");

let { verifyToken, verifyAdminRole } = require("../middlewares/autenticacion");

let app = express();

let Category = require("../models/category");

/**
 * servicio que muestra todas las categorias
 */
app.get("/category", verifyToken, (req, res) => {
    Category.find()
        .sort("description")
        .populate("user", "nombre email")
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                categories,
            });
        });
});

/**
 * servicio que muestra una categoria por id
 */
app.get("/category/:id", verifyToken, (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            category: categoryDB,
        });
    });
});

/**
 * servicio que crea una nueva categoria
 */
app.post("/category", verifyToken, (req, res) => {
    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.usuario._id,
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            category: categoryDB,
        });
    });
});

/**
 * servicio que actualiza una categoria
 */
app.put("/category/:id", verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategory = {
        description: body.description,
    };

    Category.findByIdAndUpdate(
        id,
        descCategory, { new: true, runValidators: true },
        (err, categoryBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                category: categoryBD,
            });
        }
    );
});

/**
 * servicio que elimina una categoria
 */
app.delete("/category/:id", [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndDelete(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                message: "Categoria no encontrado",
            });
        }

        res.json({
            ok: true,
            message: "Categoria borrada",
        });
    });
});

module.exports = app;