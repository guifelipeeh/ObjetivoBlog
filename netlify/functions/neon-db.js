const { neon } = require('@neondatabase/serverless'); // Mude para esta linha

exports.handler = async (event) => {
    // A variável abaixo já está configurada no seu painel Netlify
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    
    if (event.httpMethod === 'POST') {
        try {
            const { turma, titulo, url } = JSON.parse(event.body);
            // Salva na tabela 'tarefas' que você criou
            await sql`INSERT INTO tarefas (turma, titulo, url) VALUES (${turma}, ${titulo}, ${url})`;
            return { statusCode: 200, body: JSON.stringify({ message: "Sucesso!" }) };
        } catch (err) {
            return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
        }
    }

    if (event.httpMethod === 'GET') {
        try {
            const turma = event.queryStringParameters.turma;
            const dados = await sql`SELECT * FROM tarefas WHERE turma = ${turma} ORDER BY id DESC`;
            return { statusCode: 200, body: JSON.stringify(dados) };
        } catch (err) {
            return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
        }
    }
};