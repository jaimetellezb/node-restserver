require("./config/config");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Configuración global de rutas
app.use(require("./routers/index"));

const run = async() => {
    await mongoose.connect(process.env.URL_MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
};

run().then(console.log("Base de datos ONLINE")).catch(console.log);

app.listen(process.env.PORT, () =>
    console.log("Escuchando puerto:", process.env.PORT)
);