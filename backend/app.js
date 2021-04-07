const express = require('express');
const app = express();
app.use(express.json());

//Configuracion
app.use(express.urlencoded({ extended: true }));


// Rutas
app.use('/api/users', require("./routes/users.routes"));
app.use('/api/artists', require("./routes/artists.routes"));
app.use('/api/albums', require("./routes/albums.routes"));
app.use('/api/songs', require("./routes/songs.routes"));


module.exports = app;