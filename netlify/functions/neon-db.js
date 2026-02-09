const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    
    if (event.httpMethod === 'POST') {
        const { turma, titulo, url, imagem_url, data_execucao } = JSON.parse(event.body);
        await sql`INSERT INTO tarefas (turma, titulo, url, imagem_url, data_execucao) 
                  VALUES (${turma}, ${titulo}, ${url}, ${imagem_url}, ${data_execucao})`;
        return { statusCode: 200, body: "OK" };
    }
    

    if (event.httpMethod === 'GET') {
        const turma = event.queryStringParameters.turma;
        // Ordena pela data mais recente primeiro
        const tarefas = await sql`SELECT * FROM tarefas WHERE turma = ${turma} ORDER BY data_execucao DESC, id DESC`;
        return { statusCode: 200, body: JSON.stringify(tarefas) };
    }

    
    if (event.httpMethod === 'DELETE') {
        const { id } = JSON.parse(event.body);
        await sql`DELETE FROM tarefas WHERE id = ${id}`;
        return { statusCode: 200, body: "OK" };
    }
};