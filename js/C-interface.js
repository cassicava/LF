function atualizarEstadoAbas() {
    tabBtns.forEach(btn => {
        const tab = btn.getAttribute('data-tab');
        let count = 0;
        let msg = "";

        if (tab === 'pendentes') {
            count = state.pendentes.length;
            msg = "Tudo certo por aqui :)";
            btn.innerText = `Pendentes (${count})`;
        } else if (tab === 'enviados') {
            count = state.enviados.length;
            msg = "Ainda não enviamos mensagens :)";
            btn.innerText = `Enviados (${count})`;
        } else if (tab === 'erros') {
            count = state.erros.length;
            msg = "Não tivemos erros :)";
            btn.innerText = `Erros (${count})`;
        }

        if (count === 0) {
            btn.classList.add('disabled');
            btn.setAttribute('title', msg);
        } else {
            btn.classList.remove('disabled');
            btn.removeAttribute('title');
        }
    });
}

function mostrarInfoMedico() {
    atualizarEstadoAbas();

    const emoji = state.medicoGenero === 'F' ? wDocF : wDocM;
    const dataAtual = state.dataConsulta || obterDataPadrao();

    aplicarFadeTextos(() => {
        dropZone.classList.remove('processing');
        dropTitle.innerHTML = `
            <span class="doctor-date">${dataAtual}</span>
            <span class="doctor-emoji" id="doctorEmojiToggle" style="cursor: pointer; transition: transform 0.2s;" title="Clique para alterar o gênero (Médico/Médica)" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">${emoji}</span>
            <span class="doctor-name">${state.medicoNome}</span>
            <span class="doctor-specialty">${state.medicoEspecialidade}</span>
        `;
        dropSubtitle.style.display = 'none';
        dropZone.classList.add('pulse-once');

        // Lógica de alternar o gênero manualmente com clique
        document.getElementById('doctorEmojiToggle').addEventListener('click', (e) => {
            e.stopPropagation(); 
            const el = e.target;
            if (state.medicoGenero === 'F') {
                state.medicoGenero = 'M';
                el.innerText = wDocM;
            } else {
                state.medicoGenero = 'F';
                el.innerText = wDocF;
            }
        });
    });

    setTimeout(() => {
        dropZone.classList.remove('pulse-once');
        dropZone.classList.add('active');
        floatingTabs.classList.add('active');
        btnExcluir.style.display = 'block';
        contentArea.classList.add('active');
        atualizarPílula(tabBtns[0]);
        renderizarLista(abaAtual);
    }, 1600); 
}

function atualizarPílula(botao) {
    activeBg.style.width = `${botao.offsetWidth}px`;
    activeBg.style.left = `${botao.offsetLeft}px`;

    const tabName = botao.getAttribute('data-tab');
    document.body.setAttribute('data-active-tab', tabName);
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (e.target.classList.contains('disabled')) return;

        tabBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        atualizarPílula(e.target);
        abaAtual = e.target.getAttribute('data-tab');
        
        contentArea.style.opacity = '0';

        setTimeout(() => {
            renderizarLista(abaAtual);
            contentArea.style.opacity = '1';
        }, 300);
    });
});

function renderizarLista(aba) {
    contentArea.innerHTML = '';
    const dados = state[aba];

    if(dados.length === 0) return;

    let lastHour = "";

    dados.forEach((item, index) => {
        
        if (aba === 'pendentes' || aba === 'enviados') {
            let currentHour = item.horario.split(':')[0];
            if (lastHour !== "" && currentHour !== lastHour) {
                const separator = document.createElement('div');
                separator.className = 'time-separator';
                separator.innerHTML = `<span>A partir das ${currentHour}:00</span>`;
                separator.style.animationDelay = `${index * 0.1}s`;
                contentArea.appendChild(separator);
            }
            lastHour = currentHour;
        }

        const card = document.createElement('div');
        card.style.animationDelay = `${index * 0.1}s`;

        if(aba === 'erros') {
            card.className = 'card error-card';
            card.innerHTML = `
                <span class="error-icon">⚠️</span>
                <div class="error-info-container" style="color: var(--error-text);">
                    <strong>${item.nome}</strong>
                    <span style="font-size: 0.95rem; margin-top: 4px;">${item.info}</span>
                </div>
            `;
        } else {
            card.className = 'card';
            
            let btnHtml = "";
            if (aba === 'pendentes') {
                btnHtml = `<button class="btn-enviar" onclick="enviarMensagem(${item.id})">Enviar Lembrete</button>`;
            } else if (aba === 'enviados') {
                btnHtml = `<div class="enviado-container">
                    <span style="color: var(--primary-color); font-weight: bold; flex-shrink: 0;">✅ Enviado</span>
                    <button class="btn-reenviar" onclick="reenviarMensagem(${item.id})" title="Reenviar">↻</button>
                </div>`;
            }

            card.innerHTML = `
                <div class="card-info">
                    <strong>${item.nome}</strong>
                    <span class="horario-info">🕒 ${item.horario}</span>
                    <span class="telefone-info">📞 ${item.telefoneFmt}</span>
                </div>
                ${btnHtml}
            `;
            card.id = `paciente-${item.id}`;
        }
        contentArea.appendChild(card);
    });
}

function resetarInterface(comAnimacaoEsconderLista = true) {
    if (comAnimacaoEsconderLista) {
        contentArea.style.opacity = '0';
        floatingTabs.classList.remove('active');
        btnExcluir.style.opacity = '0';
    }

    hasDocument = false;

    setTimeout(() => {
        dropZone.style.border = ''; 
        dropZone.classList.remove('active', 'pulse-once', 'processing', 'error-state');
        contentArea.classList.remove('active');
        contentArea.innerHTML = '';
        btnExcluir.style.display = 'none';
        btnExcluir.style.opacity = '1';

        setTimeout(() => {
            aplicarFadeTextos(() => {
                dropTitle.innerHTML = `
                    <span class="drop-emoji-large" id="dropEmojiIcon" title="Clique para selecionar o arquivo">📄</span>
                    Solte o PDF
                `;
                dropSubtitle.style.display = 'block';
                /* CORREÇÃO AQUI: Texto atualizado */
                dropSubtitle.innerText = 'Arraste o agendamento para cá ou clique no documento';
            });
        }, 300);

        state.medicoGenero = "";
        state.pendentes = [];
        state.enviados = [];
        state.erros = [];
        
        atualizarEstadoAbas();
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabBtns[0].classList.add('active');
        tabBtns[0].innerText = "Pendentes (0)";
        tabBtns[1].innerText = "Enviados (0)";
        tabBtns[2].innerText = "Erros (0)";
        abaAtual = 'pendentes';
        
        if (comAnimacaoEsconderLista) {
            setTimeout(() => {
                contentArea.style.opacity = '1';
                atualizarPílula(tabBtns[0]);
            }, 600);
        }

    }, comAnimacaoEsconderLista ? 500 : 0);
}