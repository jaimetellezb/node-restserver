const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const app = express();

const Usuario = require("../models/usuario");
const Product = require("../models/product");

// default options
app.use(fileUpload());

app.put("/upload/:type/:id", function(req, res) {
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "No se ha seleccionado un archivo",
            },
        });
    }

    let validTypes = ["products", "users"];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `los tipos permitidos son ${validTypes.join(", ")}`,
                type,
            },
        });
    }

    let file = req.files.file;

    let filenameArr = file.name.split(".");
    let extension = filenameArr[filenameArr.length - 1];

    let validExtensions = ["png", "jpg", "gif", "jpeg"];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `las extensiones permitidas son ${validExtensions.join(", ")}`,
                ext: extension,
            },
        });
    }

    // cambiar nombre al archivo
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    file.mv(`uploads/${type}/${fileName}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err,
            });

        // ya se cargó la imagen
        if (type === "users") {
            imageUser(id, res, fileName);
        } else {
            imageProduct(id, res, fileName);
        }
    });
});

function imageUser(id, res, fileName) {
    Usuario.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(fileName, "users");
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!userDB) {
            deleteFile(fileName, "users");
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no existe",
                },
            });
        }

        deleteFile(userDB.img, "users");

        userDB.img = fileName;

        userDB.save((err, newUser) => {
            res.json({
                ok: true,
                user: newUser,
                img: fileName,
            });
        });
    });
}

function imageProduct(id, res, fileName) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(fileName, "products");
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productDB) {
            deleteFile(fileName, "products");
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto no existe",
                },
            });
        }

        deleteFile(productDB.img, "products");

        productDB.img = fileName;

        productDB.save((err, newProduct) => {
            res.json({
                ok: true,
                product: newProduct,
                img: fileName,
            });
        });
    });
}

function deleteFile(imageName, type) {
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${imageName}`);

    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;