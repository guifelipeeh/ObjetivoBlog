const { neon } = require('@netlify/neon');

exports.handler = async (event) => {
    // Esta variável NETLIFY_DATABASE_URL já está configurada no seu painel
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    
    // Lógica para SALVAR nova tarefa (Método POST)
    if (event.httpMethod === 'POST') {
        try {
            const { turma, titulo, url } = JSON.parse(event.body);
            
            // Insere os dados exatamente nas colunas que você criou: id, turma, titulo, url
            await sql`
                INSERT INTO tarefas (turma, titulo, url) 
                VALUES (${turma}, ${titulo}, ${url})
            `;
            
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Atividade salva no banco Neon!" })
            };
        } catch (error) {
            return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
        }
    }

    // Lógica para BUSCAR tarefas (Método GET)
    if (event.httpMethod === 'GET') {
        try {
            const turma = event.queryStringParameters.turma;
            
            // Busca as tarefas da turma selecionada
            const resultado = await sql`
                SELECT * FROM tarefas 
                WHERE turma = ${turma} 
                ORDER BY id DESC
            `;
            
            return {
                statusCode: 200,
                body: JSON.stringify(resultado)
            };
        } catch (error) {
            return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
        }
    }
};