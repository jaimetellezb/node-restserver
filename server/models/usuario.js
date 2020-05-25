const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

let roles = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: "{VALUE} no es un rol válido",
};

const usuarioSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre es necesario"] },
    email: {
        type: String,
        unique: true,
        required: [true, "El correo es necesario"],
    },
    password: { type: String, required: [true, "La contraseña es obligatoria"] },
    img: { type: String },
    role: { type: String, default: "USER_ROLE", enum: roles },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false },
});

// se agrega método toJSON para eliminar el campo password
// y no lo devuelva
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

// Apply the uniqueValidator plugin to userSchema.
usuarioSchema.plugin(uniqueValidator, {
    message: "Error, el {PATH} debe ser único.",
});

module.exports = mongoose.model("Usuario", usuarioSchema);