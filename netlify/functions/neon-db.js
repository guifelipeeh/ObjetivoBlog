async function salvarNoBanco() {
    let urlOriginal = document.getElementById('url-tarefa').value;
    
    // CONVERSÃO CRÍTICA: Transforma o link comum em link de jogo (Embed)
    // Isso evita o erro de "Conexão Recusada"
    let urlConvertida = urlOriginal.replace("wordwall.net/resource/", "wordwall.net/embed/resource/");

    const dados = {
        turma: document.getElementById('sel-turma').value,
        titulo: document.getElementById('tit-tarefa').value,
        url: urlConvertida // Enviamos o link já pronto para o iframe
    };

    const resp = await fetch('/.netlify/functions/neon-db', { 
        method: 'POST', 
        body: JSON.stringify(dados) 
    });

    if(resp.ok) {
        alert("Tarefa salva com sucesso na tabela!");
        document.getElementById('modal-adm').classList.add('hidden');
        location.reload(); // Recarrega para exibir a nova atividade
    }
}