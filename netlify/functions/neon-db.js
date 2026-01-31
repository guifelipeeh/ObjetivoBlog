const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    
    // CRIAR TAREFA
    if (event.httpMethod === 'POST') {
        const { turma, titulo, url, imagem_url } = JSON.parse(event.body);
        await sql`INSERT INTO tarefas (turma, titulo, url, imagem_url) VALUES (${turma}, ${titulo}, ${url}, ${imagem_url})`;
        return { statusCode: 200, body: "Criado" };
    }
    
    // LISTAR TAREFAS
    if (event.httpMethod === 'GET') {
        const turma = event.queryStringParameters.turma;
        const tarefas = await sql`SELECT * FROM tarefas WHERE turma = ${turma} ORDER BY id DESC`;
        return { statusCode: 200, body: JSON.stringify(tarefas) };
    }

    // ELIMINAR TAREFA (NOVO)
    if (event.httpMethod === 'DELETE') {
        const { id } = JSON.parse(event.body);
        await sql`DELETE FROM tarefas WHERE id = ${id}`;
        return { statusCode: 200, body: "Eliminado" };
    }
};