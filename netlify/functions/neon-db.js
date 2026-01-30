const { neon } = require('@neondatabase/serverless');

// O segredo está nesta linha: exports.handler
exports.handler = async (event) => {
    // Puxa a conexão automática do seu painel
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    try {
        // Lógica para SALVAR (POST)
        if (event.httpMethod === 'POST') {
            const { turma, titulo, url } = JSON.parse(event.body);
            // Salva na sua tabela 'tarefas'
            await sql`INSERT INTO tarefas (turma, titulo, url) VALUES (${turma}, ${titulo}, ${url})`;
            return { 
                statusCode: 200, 
                body: JSON.stringify({ message: "Salvo no Neon!" }) 
            };
        }

        // Lógica para BUSCAR (GET)
        if (event.httpMethod === 'GET') {
            const turma = event.queryStringParameters.turma;
            // Busca os dados reais da tabela
            const dados = await sql`SELECT * FROM tarefas WHERE turma = ${turma} ORDER BY id DESC`;
            return { 
                statusCode: 200, 
                body: JSON.stringify(dados) 
            };
        }
    } catch (error) {
        // Se der erro, ele avisa nos logs
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.message }) 
        };
    }
};