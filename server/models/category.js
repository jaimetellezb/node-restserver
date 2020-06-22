const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, "La descripción es necesaria"],
    },
    user: { type: Schema.Types.ObjectId, ref: "Usuario" },
});

module.exports = mongoose.model("Category", categorySchema);