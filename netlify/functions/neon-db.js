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

        if (event.httpMethod === 'GET') {
            const turma = event.queryStringParameters.turma;
            const tarefas = await sql`SELECT * FROM tarefas WHERE turma = ${turma} ORDER BY data_execucao ASC, id ASC`;
            return { statusCode: 200, headers, body: JSON.stringify(tarefas) };
        }

        if (event.httpMethod === 'POST') {
            const { turma, titulo, url, imagem_url, data_execucao } = JSON.parse(event.body);
            await sql`INSERT INTO tarefas (turma, titulo, url, imagem_url, data_execucao) 
                      VALUES (${turma}, ${titulo}, ${url}, ${imagem_url}, ${data_execucao})`;
            return { statusCode: 200, headers, body: JSON.stringify({ message: "OK" }) };
        }

        if (event.httpMethod === 'DELETE') {
            const { id } = JSON.parse(event.body);
            await sql`DELETE FROM tarefas WHERE id = ${id}`;
            return { statusCode: 200, headers, body: JSON.stringify({ message: "OK" }) };
        }

    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ details: error.message }) };
    }
};