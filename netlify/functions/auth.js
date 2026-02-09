const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers };

    try {
        const sql = neon(process.env.DATABASE_URL);
        const body = JSON.parse(event.body);
        const { action, email, senha, nome } = body;

        // REGISTRO DE NOVO ADM
        if (action === 'register') {
            const result = await sql`
                INSERT INTO usuarios (nome, email, senha) 
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
            return { statusCode: 401, headers, body: JSON.stringify({ message: "Incorreto" }) };
        }

        return { statusCode: 400, headers, body: JSON.stringify({ message: "Ação inválida" }) };

    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ details: error.message }) };
    }
};