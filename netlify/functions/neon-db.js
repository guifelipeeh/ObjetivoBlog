const { neon } = require('@netlify/neon');

exports.handler = async (event) => {
    // Utiliza a variável NETLIFY_DATABASE_URL já configurada no seu painel
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    
    if (event.httpMethod === 'POST') {
        const { turma, titulo, url } = JSON.parse(event.body);
        // Insere os dados nas colunas: turma, titulo, url
        await sql`INSERT INTO tarefas (turma, titulo, url) VALUES (${turma}, ${titulo}, ${url})`;
        return { statusCode: 200, body: JSON.stringify({ message: "Sucesso!" }) };
    }

    if (event.httpMethod === 'GET') {
        const turma = event.queryStringParameters.turma;
        const dados = await sql`SELECT * FROM tarefas WHERE turma = ${turma} ORDER BY id DESC`;
        return { statusCode: 200, body: JSON.stringify(dados) };
    }
};