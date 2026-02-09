const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
    const sql = neon(process.env.DATABASE_URL);

    try {
        const { action, email, senha, nome } = JSON.parse(event.body);

        if (action === 'register') {
            const result = await sql`INSERT INTO usuarios (nome, email, senha) VALUES (${nome}, ${email}, ${senha}) RETURNING nome`;
            return { statusCode: 200, headers, body: JSON.stringify({ nome: result[0].nome }) };
        }

        if (action === 'login') {
            const users = await sql`SELECT nome FROM usuarios WHERE email = ${email} AND senha = ${senha}`;
            if (users.length > 0) return { statusCode: 200, headers, body: JSON.stringify({ nome: users[0].nome }) };
            return { statusCode: 401, headers, body: JSON.stringify({ message: "Incorreto" }) };
        }
    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
};