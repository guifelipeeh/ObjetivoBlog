const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers };

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: "Variável DATABASE_URL não configurada no Netlify." }) };
    }

    const sql = neon(connectionString);

    try {
        // LISTAR TAREFAS
        if (event.httpMethod === 'GET') {
            const turma = event.queryStringParameters.turma;
            // Ordenação ASC para cronograma correto (mais antigas primeiro)
            const tarefas = await sql`SELECT * FROM tarefas WHERE turma = ${turma} ORDER BY data_execucao ASC, id ASC`;
            return { statusCode: 200, headers, body: JSON.stringify(tarefas) };
        }

        // SALVAR NOVA TAREFA
        if (event.httpMethod === 'POST') {
            const { turma, titulo, url, imagem_url, data_execucao } = JSON.parse(event.body);
            await sql`INSERT INTO tarefas (turma, titulo, url, imagem_url, data_execucao) 
                      VALUES (${turma}, ${titulo}, ${url}, ${imagem_url}, ${data_execucao})`;
            return { statusCode: 200, headers, body: JSON.stringify({ message: "Sucesso" }) };
        }

        // DELETAR TAREFA
        if (event.httpMethod === 'DELETE') {
            const { id } = JSON.parse(event.body);
            await sql`DELETE FROM tarefas WHERE id = ${id}`;
            return { statusCode: 200, headers, body: JSON.stringify({ message: "Sucesso" }) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
};