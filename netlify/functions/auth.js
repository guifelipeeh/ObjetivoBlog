const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    const sql = neon(process.env.DATABASE_URL);
    
    try {
        const { action, email, senha, nome } = JSON.parse(event.body);

        if (action === 'register') {
            // Insere o novo usuário no banco Neon
            const result = await sql`
                INSERT INTO usuarios (nome, email, senha) 
                VALUES (${nome}, ${email}, ${senha}) 
                RETURNING nome, email`;
            
            return {
                statusCode: 200,
                body: JSON.stringify(result[0])
            };
        }

        if (action === 'login') {
            const users = await sql`SELECT * FROM usuarios WHERE email = ${email} AND senha = ${senha}`;
            
            if (users.length > 0) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ nome: users[0].nome })
                };
            } else {
                return { statusCode: 401, body: JSON.stringify({ message: "Dados inválidos" }) };
            }
        }
    } catch (error) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ message: "Erro no servidor", details: error.message }) 
        };
    }
};