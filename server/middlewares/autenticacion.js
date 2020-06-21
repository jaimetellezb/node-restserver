const jwt = require("jsonwebtoken");

/**
 * Verificar token
 */
let verifyToken = (req, res, next) => {
    // obtener el valor de token del header
    let token = req.get("token");

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token no válido",
                },
            });
        }

        req.usuario = decoded.usuario;

        console.log(token);
        next();
    });
};

/**
 * Verificar adminRole
 */
let verifyAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        res.json({
            ok: true,
            err: {
                message: "El usuario no es administrador",
            },
        });
    }
};

module.exports = {
    verifyToken,
    verifyAdminRole,
};