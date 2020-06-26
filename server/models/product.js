var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "El nombre es necesario"],
    },
    priceUni: {
        type: Number,
        required: [true, "El precio unitario es necesario"],
    },
    description: { type: String, required: false },
    img: { type: String, required: false },
    available: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    user: { type: Schema.Types.ObjectId, ref: "Usuario" },
});

module.exports = mongoose.model("Product", productSchema);