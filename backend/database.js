const mongoose = require('mongoose');
const URI = "mongodb+srv://daniel:8NPb7joVnEXk54VH@cluster0.s7spx.mongodb.net/tfgDani?retryWrites=true&w=majority";

mongoose.connect(URI)
    .then(db => console.log('DB conectada'))
    .catch(err => console.error(err));

module.exports = mongoose;