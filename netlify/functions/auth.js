const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const { action, nome, email, senha } = JSON.parse(event.body);

    try {
        if (action === 'register') {
            await sql`INSERT INTO usuarios (nome, email, senha) VALUES (${nome}, ${email}, ${senha})`;
            return { statusCode: 200, body: JSON.stringify({ message: "Registrado!" }) };
        }

        if (action === 'login') {
            const usuario = await sql`SELECT * FROM usuarios WHERE email = ${email} AND senha = ${senha}`;
            if (usuario.length > 0) {
                return { 
                    statusCode: 200, 
                    body: JSON.stringify({ logged: true, nome: usuario[0].nome }) 
                };
            }
            return { statusCode: 401, body: JSON.stringify({ message: "Credenciais inválidas" }) };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};