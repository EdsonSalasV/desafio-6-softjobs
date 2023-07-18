const pool = require('./conexiones')
const bcrypt = require('bcryptjs')


const registrarUsuario = async (usuario) => {
    let { email, password, rol, lenguage } = usuario;
    const passwordEncriptada = bcrypt.hashSync(password);
    password = passwordEncriptada;
    const values = [email, passwordEncriptada, rol, lenguage];
    const consultas = 'INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)';
    await pool.query(consultas, values);
};

const obtenerDatosDeUsuario = async (email) => {
    const values = [email];
    const consulta = "SELECT *FROM usuarios WHERE email = $1";

    const { rows: [usuario], rowCount } = await pool.query(consulta, values);

    if (!rowCount) {
        throw {
            code: 404, message: "no se encontro usuario con este email",
        };
    }

    delete usuario.password;
    return usuario;
};

const verificarCredenciales = async (email, password) => {
    const values = [email];
    const consulta = "SELECT * FROM usuarios WHERE email = $1";

    const { rows: [usuario], rowCount, } = await pool.query(consulta, values);

    const { password: passwordEncriptada } = usuario;
    const passwordCorrecta = bcrypt.compareSync(password, passwordEncriptada);

    if (!passwordCorrecta || !rowCount)
        throw { code: 401, message: "email o contraseña incorrecta" };
};

module.exports = {
    registrarUsuario,
    obtenerDatosDeUsuario,
    verificarCredenciales,
};