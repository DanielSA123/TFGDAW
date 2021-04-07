const session = require('express-session');
const morgan = require('morgan');
const MongoStore = require('connect-mongo')(session);
const { mongoose } = require('./database');
const app = require('./app');
const bodyParser = require('body-parser');


app.set('port', process.env.PORT || 3000);
//Middlewares
app.use(morgan('dev'));
app.use(session({
    secret: 'DANIEL',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: "mongodb+srv://daniel:8NPb7joVnEXk54VH@cluster0.s7spx.mongodb.net/tfgDani?retryWrites=true&w=majority",
        autoReconnect: true,

    }),
}))

// Iniciar servidor
app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto ', app.get('port'));
});