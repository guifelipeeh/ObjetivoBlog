const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
    // 1. Verificação da Variável de Ambiente
    const connectionString = process.env.DATABASE_URL; // Usando o nome padrão DATABASE_URL

    if (!connectionString) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Configuração ausente: DATABASE_URL não encontrada." })
        };
    }

    const sql = neon(connectionString);

    try {
        // --- MÉTODO POST (Salvar Tarefa) ---
        if (event.httpMethod === 'POST') {
            const { turma, titulo, url, imagem_url, data_execucao } = JSON.parse(event.body);
            await sql`INSERT INTO tarefas (turma, titulo, url, imagem_url, data_execucao) 
                      VALUES (${turma}, ${titulo}, ${url}, ${imagem_url}, ${data_execucao})`;
            return { statusCode: 200, body: "OK" };
        }

        // --- MÉTODO GET (Listar Tarefas) ---
        if (event.httpMethod === 'GET') {
            const turma = event.queryStringParameters.turma;
            // Ajustado para ORDER BY data_execucao ASC (Ordem Cronológica: Antigas primeiro)
            const tarefas = await sql`
                SELECT * FROM tarefas 
                WHERE turma = ${turma} 
                ORDER BY data_execucao ASC, id ASC`;
            
            return { 
                statusCode: 200, 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tarefas) 
            };
        }

        // --- MÉTODO DELETE (Apagar Tarefa) ---
        if (event.httpMethod === 'DELETE') {
            const { id } = JSON.parse(event.body);
            await sql`DELETE FROM tarefas WHERE id = ${id}`;
            return { statusCode: 200, body: "OK" };
        }

        return { statusCode: 405, body: "Método não permitido" };

    } catch (error) {
        console.error("Erro no Banco de Dados:", error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "Erro interno no banco de dados", details: error.message }) 
        };
    }
};