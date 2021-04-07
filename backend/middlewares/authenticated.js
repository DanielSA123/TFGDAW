const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_tfg_dani';


exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La peticion no tiene la cabezera de autenticacion' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'Token expirado' });
        }
    } catch (error) {
        console.log(error);
        return res.status(404).send({ message: 'Token no valido' });
    }

    req.user = payload;
    next();
}