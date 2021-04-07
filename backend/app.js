const express = require('express');
const app = express();
app.use(express.json());

//Configuracion
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Accept,Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    res.header('Allow', 'GET,POST,OPTIONS,PUT,DELETE');
    next();
})

// Rutas
app.use('/api/users', require("./routes/users.routes"));
app.use('/api/artists', require("./routes/artists.routes"));
app.use('/api/albums', require("./routes/albums.routes"));
app.use('/api/songs', require("./routes/songs.routes"));


module.exports = app;