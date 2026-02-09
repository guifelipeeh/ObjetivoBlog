const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers };

    // Importante: Verifique se a variável no Netlify é DATABASE_URL
    const sql = neon(process.env.DATABASE_URL);

    try {
        const body = JSON.parse(event.body);
        const { action, email, senha, nome } = body;

        // AÇÃO DE REGISTRO
        if (action === 'register') {
            const result = await sql`
                INSERT INTO usuarios (nome, email, senha) 
                VALUES (${nome}, ${email}, ${senha}) 
                RETURNING nome, email`;
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ nome: result[0].nome, message: "Conta criada!" })
            };
        }

        // AÇÃO DE LOGIN
        if (action === 'login') {
            const users = await sql`SELECT nome FROM usuarios WHERE email = ${email} AND senha = ${senha}`;
            if (users.length > 0) {
                return { statusCode: 200, headers, body: JSON.stringify({ nome: users[0].nome }) };
            }
            return { statusCode: 401, headers, body: JSON.stringify({ message: "Credenciais inválidas" }) };
        }

    } catch (error) {
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: "Erro no servidor", details: error.message }) 
        };
    }
};