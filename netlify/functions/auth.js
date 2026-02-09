const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    // Configuração de CORS para evitar bloqueios de requisição
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers };

    try {
        const sql = neon(process.env.DATABASE_URL);
        const body = JSON.parse(event.body);
        const { action, email, senha, nome } = body;

        // LÓGICA DE REGISTRO
        if (action === 'register') {
            const result = await sql`
                INSERT INTO usuarios (nome, email, senha) 
                VALUES (${nome}, ${email}, ${senha}) 
                RETURNING nome, email`;
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ nome: result[0].nome, message: "Sucesso" })
            };
        }

        // LÓGICA DE LOGIN
        if (action === 'login') {
            const users = await sql`SELECT nome FROM usuarios WHERE email = ${email} AND senha = ${senha}`;
            
            if (users.length > 0) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ nome: users[0].nome })
                };
            } else {
                return { 
                    statusCode: 401, 
                    headers,
                    body: JSON.stringify({ message: "E-mail ou senha incorretos" }) 
                };
            }
        }

        return { statusCode: 400, headers, body: JSON.stringify({ message: "Ação inválida" }) };

    } catch (error) {
        console.error("Erro na Function Auth:", error);
        return { 
            statusCode: 500, 
            headers,
            body: JSON.stringify({ message: "Erro interno", error: error.message }) 
        };
    }
};