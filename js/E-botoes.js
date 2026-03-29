['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

dropZone.addEventListener('dragover', () => {
    if (hasDocument) return;
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    if (hasDocument) return;
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    if (hasDocument) {
        alert("Por favor, exclua o arquivo atual antes de inserir um novo.");
        return;
    }
    
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    
    if(files.length > 0 && files[0].type === "application/pdf") {
        hasDocument = true;
        iniciarProcessamentoAnimacao(files[0]);
    } else {
        alert("Por favor, solte apenas arquivos PDF.");
    }
});

// ===================================================================
// NOVA LÓGICA DO CLIQUE NO EMOJI (ABRE O EXPLORADOR DE ARQUIVOS)
// ===================================================================
const fileInput = document.getElementById('fileInput');

// 1. Escuta o clique global, mas só age se for no emoji
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'dropEmojiIcon') {
        // Bloqueia clique por segurança se já tiver doc ou estiver a arrastar
        if (hasDocument || dropZone.classList.contains('dragover')) return;
        fileInput.click();
    }
});

// 2. Quando o usuário seleciona o arquivo na janela do Windows/Mac
fileInput.addEventListener('change', (e) => {
    if (hasDocument) return;
    const files = e.target.files;
    
    if(files.length > 0 && files[0].type === "application/pdf") {
        hasDocument = true;
        iniciarProcessamentoAnimacao(files[0]);
    } else if (files.length > 0) {
        alert("Por favor, selecione apenas arquivos PDF.");
    }
    
    // Limpa o input para que o usuário possa re-selecionar o mesmo arquivo se ele excluir
    e.target.value = '';
});


window.enviarMensagem = function(id) {
    const pacienteIndex = state.pendentes.findIndex(p => p.id === id);
    if(pacienteIndex === -1) return;

    const paciente = state.pendentes[pacienteIndex];
    const dataDisplay = state.dataConsulta || obterDataPadrao();
    
    let mensagemTemplate = localStorage.getItem('msgTemplateLF_v3') || templatePadrao;
    
    const isMulher = state.medicoGenero === 'F';
    const prefixo = isMulher ? 'Dra. ' : 'Dr. ';
    const emojiMedico = isMulher ? wDocF : wDocM;
    
    let msgFinal = mensagemTemplate
        .replace(/\{\{nome\}\}/g, paciente.nome)
        .replace(/\{\{data\}\}/g, dataDisplay)
        .replace(/\{\{horario\}\}/g, paciente.horario)
        .replace(/\{\{medico\}\}/g, prefixo + state.medicoNome + " - " + state.medicoEspecialidade)
        .replace(/\{\{emoji_medico\}\}/g, emojiMedico);
    
    window.open(`https://api.whatsapp.com/send?phone=${paciente.telefoneLnk}&text=${encodeURIComponent(msgFinal)}`, '_blank');
    
    const cardElement = document.getElementById(`paciente-${id}`);
    cardElement.classList.add('removing');

    setTimeout(() => {
        const pacienteRemovido = state.pendentes.splice(pacienteIndex, 1)[0];
        state.enviados.push(pacienteRemovido);
        
        atualizarEstadoAbas();

        if (state.pendentes.length === 0 && abaAtual === 'pendentes') {
            esperandoVoltaConfete = true;
            const btnEnviados = Array.from(tabBtns).find(b => b.getAttribute('data-tab') === 'enviados');
            if (btnEnviados) btnEnviados.click();
        } else {
            renderizarLista(abaAtual);
        }
    }, 400);
};

window.reenviarMensagem = function(id) {
    const paciente = state.enviados.find(p => p.id === id);
    if(!paciente) return;

    const dataDisplay = state.dataConsulta || obterDataPadrao();
    let mensagemTemplate = localStorage.getItem('msgTemplateLF_v3') || templatePadrao;
    
    const isMulher = state.medicoGenero === 'F';
    const prefixo = isMulher ? 'Dra. ' : 'Dr. ';
    const emojiMedico = isMulher ? wDocF : wDocM;
    
    let msgFinal = mensagemTemplate
        .replace(/\{\{nome\}\}/g, paciente.nome)
        .replace(/\{\{data\}\}/g, dataDisplay)
        .replace(/\{\{horario\}\}/g, paciente.horario)
        .replace(/\{\{medico\}\}/g, prefixo + state.medicoNome + " - " + state.medicoEspecialidade)
        .replace(/\{\{emoji_medico\}\}/g, emojiMedico);
    
    window.open(`https://api.whatsapp.com/send?phone=${paciente.telefoneLnk}&text=${encodeURIComponent(msgFinal)}`, '_blank');
};

btnExcluir.addEventListener('click', () => {
    clearInterval(processInterval);
    resetarInterface(true);
});