const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers };

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: "Erro de ambiente." }) };
    }

    const sql = neon(connectionString);

    try {
        const { action, email, senha, nome } = JSON.parse(event.body);

        // REGISTRO
        if (action === 'register') {
            const result = await sql`INSERT INTO usuarios (nome, email, senha) 
                                     VALUES (${nome}, ${email}, ${senha}) 
                                     RETURNING nome`;
            return { statusCode: 200, headers, body: JSON.stringify({ nome: result[0].nome }) };
        }

        // LOGIN
        if (action === 'login') {
            const users = await sql`SELECT nome FROM usuarios WHERE email = ${email} AND senha = ${senha}`;
            if (users.length > 0) {
                return { statusCode: 200, headers, body: JSON.stringify({ nome: users[0].nome }) };
            }
            return { statusCode: 401, headers, body: JSON.stringify({ message: "Credenciais inválidas." }) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
};