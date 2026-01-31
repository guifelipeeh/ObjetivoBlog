// netlify/functions/neon-db.js
const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    
    if (event.httpMethod === 'POST') {
        const { turma, titulo, url, imagem_url } = JSON.parse(event.body);
        await sql`INSERT INTO tarefas (turma, titulo, url, imagem_url) VALUES (${turma}, ${titulo}, ${url}, ${imagem_url})`;
        return { statusCode: 200, body: "OK" };
    }
    
    if (event.httpMethod === 'GET') {
        const turma = event.queryStringParameters.turma;
        const tarefas = await sql`SELECT * FROM tarefas WHERE turma = ${turma}`;
        return { statusCode: 200, body: JSON.stringify(tarefas) };
    }
};