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

window.enviarMensagem = function(id) {
    const pacienteIndex = state.pendentes.findIndex(p => p.id === id);
    if(pacienteIndex === -1) return;

    const paciente = state.pendentes[pacienteIndex];
    const dataDisplay = state.dataConsulta || obterDataPadrao();
    
    let mensagemTemplate = localStorage.getItem('msgTemplateLF_v3') || templatePadrao;
    const isMulher = state.medicoNome.toLowerCase().endsWith('a');
    const prefixo = isMulher ? 'Dra. ' : 'Dr. ';
    const emojiMedico = isMulher ? wDocF : wDocM;
    
    let msgFinal = mensagemTemplate
        .replace(/\{\{nome\}\}/g, paciente.nome)
        .replace(/\{\{data\}\}/g, dataDisplay)
        .replace(/\{\{horario\}\}/g, paciente.horario)
        .replace(/\{\{medico\}\}/g, prefixo + state.medicoNome + " - " + state.medicoEspecialidade)
        .replace(/\{\{emoji_medico\}\}/g, emojiMedico);
    
    window.open(`https://wa.me/${paciente.telefoneLnk}?text=${encodeURIComponent(msgFinal)}`, '_blank');
    
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
    const isMulher = state.medicoNome.toLowerCase().endsWith('a');
    const prefixo = isMulher ? 'Dra. ' : 'Dr. ';
    const emojiMedico = isMulher ? wDocF : wDocM;
    
    let msgFinal = mensagemTemplate
        .replace(/\{\{nome\}\}/g, paciente.nome)
        .replace(/\{\{data\}\}/g, dataDisplay)
        .replace(/\{\{horario\}\}/g, paciente.horario)
        .replace(/\{\{medico\}\}/g, prefixo + state.medicoNome + " - " + state.medicoEspecialidade)
        .replace(/\{\{emoji_medico\}\}/g, emojiMedico);
    
    window.open(`https://wa.me/${paciente.telefoneLnk}?text=${encodeURIComponent(msgFinal)}`, '_blank');
};

btnExcluir.addEventListener('click', () => {
    clearInterval(processInterval);
    resetarInterface(true);
});