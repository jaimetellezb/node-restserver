const express = require("express");
const _ = require("underscore");
let { verifyToken } = require("../middlewares/autenticacion");

let app = express();
let Product = require("../models/product");

module.exports = app;

/**
 * Obtener todos los productos
 */
app.get("/products", verifyToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado
    let from = Number(req.query.from || 0);
    let limit = Number(req.query.limit || 5);

    Product.find({ available: true })
        .skip(from)
        .limit(limit)
        .populate("user", "nombre email")
        .populate("category", "description")
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            Product.countDocuments({ available: true }, (err, count) => {
                res.json({
                    ok: true,
                    products,
                    count,
                });
            });
        });
});

/**
 * Obtener un producto por ID
 */
app.get("/products/:id", verifyToken, (req, res) => {
    // populate: usuario categoria
    let id = req.params.id;
    Product.findById(id)
        .populate("user", "nombre email")
        .populate("category", "description")
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                product: productDB,
            });
        });
});

/**
 * Buscar productos
 */
app.get("/products/search/:term", verifyToken, (req, res) => {
    let term = req.params.term;

    let regex = new RegExp(term, "i");

    Product.find({ name: regex })
        .populate("category", "description")
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                products,
            });
        });
});

/**
 * crear un nuevo producto
 */
app.post("/products", verifyToken, (req, res) => {
    // grabar usuario
    // grabar una categoria del listado
    console.log(req);
    let body = req.body;

    let product = new Product({
        name: body.name,
        priceUni: body.priceUni,
        description: body.description,
        category: body.idCategory,
        user: req.usuario._id,
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            product: productDB,
        });
    });
});

/**
 * actualizar un producto
 */
app.put("/products/:id", verifyToken, (req, res) => {
    let id = req.params.id;
    let body = _.omit(req.body, "name", "category", "user");

    Product.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true },
        (err, productBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                product: productBD,
            });
        }
    );
});

/**
 * borrar un producto
 */
app.delete("/products/:id", verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findByIdAndUpdate(
        id, { available: false }, { new: true },
        (err, productDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                product: productDB,
            });
        }
    );
});