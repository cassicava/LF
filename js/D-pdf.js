function formatarNomeDinamico(nomeBruto) {
    const excecoes = ['da', 'de', 'do', 'das', 'dos', 'e'];
    return nomeBruto.toLowerCase().split(' ').map(palavra => {
        if (excecoes.includes(palavra)) return palavra;
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    }).join(' ');
}

function obterDataPadrao() {
    const opcoes = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date().toLocaleDateString('pt-BR', opcoes);
}

function aplicarFadeTextos(callback) {
    dropTitle.style.opacity = '0';
    dropTitle.style.transform = 'scale(0.9)';
    dropSubtitle.style.opacity = '0';
    dropSubtitle.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        callback();
        dropTitle.style.opacity = '1';
        dropTitle.style.transform = 'scale(1)';
        dropSubtitle.style.opacity = '1';
        dropSubtitle.style.transform = 'scale(1)';
    }, 400);
}

async function iniciarProcessamentoAnimacao(file) {
    aplicarFadeTextos(() => {
        dropTitle.innerHTML = `<span class="spinning-gear">\u2699\uFE0F</span>`;
        dropSubtitle.style.display = 'block';
        dropSubtitle.innerText = 'Lendo documento...';
        dropZone.classList.add('processing'); // Aciona os traços a girar
    });

    const docEmojis = ['\uD83D\uDCC4', '\uD83D\uDCC1', '\uD83D\uDCDD', '\uD83D\uDD0D', '\uD83D\uDCCA'];
    
    processInterval = setInterval(() => {
        const el = document.createElement('div');
        el.className = 'flying-emoji';
        el.innerText = docEmojis[Math.floor(Math.random() * docEmojis.length)];
        
        const rect = dropZone.getBoundingClientRect();
        el.style.left = (rect.left + rect.width / 2) + 'px';
        el.style.top = (rect.top + rect.height / 2) + 'px';
        
        const tx = (Math.random() - 0.5) * 350 + 'px';
        const ty = - (Math.random() * 200 + 100) + 'px';
        const rot = (Math.random() - 0.5) * 90 + 'deg';
        
        el.style.setProperty('--tx', tx);
        el.style.setProperty('--ty', ty);
        el.style.setProperty('--rot', rot);
        
        document.body.appendChild(el);
        
        setTimeout(() => el.remove(), 1500);
    }, 300);

    let isDocumentoValido = true;

    try {
        await processarPDFReal(file);
    } catch (e) {
        isDocumentoValido = false;
    }

    setTimeout(() => {
        clearInterval(processInterval);
        
        if (isDocumentoValido) {
            mostrarInfoMedico();
        } else {
            exibirErroDocumento();
        }
    }, 5000);
}

function exibirErroDocumento() {
    aplicarFadeTextos(() => {
        dropZone.classList.remove('processing');
        dropZone.classList.add('error-state');
        dropTitle.innerHTML = `<span style="font-size: 3.5rem; display: block; margin-bottom: 10px;">\u274C</span>Documento Inv\u00E1lido`;
        dropSubtitle.style.display = 'block';
        dropSubtitle.innerText = 'Utilize o relat\u00F3rio padr\u00E3o do sistema.';
        dropSubtitle.style.color = 'var(--error-text)';
        dropSubtitle.style.fontWeight = 'bold';
    });

    setTimeout(() => {
        dropZone.classList.remove('error-state');
        dropSubtitle.style.color = 'var(--text-muted)';
        dropSubtitle.style.fontWeight = 'normal';
        resetarInterface(false);
    }, 4000);
}

async function processarPDFReal(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let linhas = [];

    for (let num = 1; num <= pdf.numPages; num++) {
        const page = await pdf.getPage(num);
        const content = await page.getTextContent();
        let lastY = -1;
        let currentLine = "";

        content.items.forEach(item => {
            if (lastY !== item.transform[5]) {
                if (currentLine) linhas.push(currentLine.trim());
                currentLine = item.str;
                lastY = item.transform[5];
            } else {
                currentLine += " " + item.str;
            }
        });
        if (currentLine) linhas.push(currentLine.trim());
    }

    let isCompatible = linhas.some(l => l.includes('Profissional:'));
    if (!isCompatible) {
        throw new Error("Documento incompativel");
    }

    state.medicoNome = "Sem Nome";
    state.medicoEspecialidade = "";
    state.dataConsulta = "";
    state.pendentes = [];
    state.enviados = [];
    state.erros = [];

    let profLine = linhas.find(l => l.includes('Profissional:'));
    if (profLine) {
        let profMatch = profLine.match(/Profissional:\s*(.*?)\s*-\s*(.*)/);
        if (profMatch) {
            state.medicoNome = formatarNomeDinamico(profMatch[1].split(' ')[0]);
            let especialidadeBruta = profMatch[2].toUpperCase();
            especialidadeBruta = especialidadeBruta.replace('M\u00C9DICO ', '').replace('MEDICO ', '').replace('M\u00C9DICA ', '').replace('MEDICA ', '').trim();
            state.medicoEspecialidade = formatarNomeDinamico(especialidadeBruta.split(' ')[0]);
        }
    }

    let dataLine = linhas.find(l => l.includes('Data:'));
    if (dataLine) {
        let dMatch = dataLine.match(/Data:\s*(\d{2}\/\d{2}\/\d{4})/);
        if (dMatch) {
            state.dataConsulta = dMatch[1];
        }
    }

    let currentPatient = null;
    let pacId = 1;

    for (let i = 0; i < linhas.length; i++) {
        let linha = linhas[i];

        if (linha.match(/\d+\s+anos/)) {
            if (currentPatient) {
                state.erros.push({
                    id: pacId++,
                    nome: currentPatient.nome,
                    info: "Campo 'Observa\u00E7\u00E3o' ausente no relat\u00F3rio."
                });
            }

            let nomePossivel = linhas[i - 1];
            if (nomePossivel && !nomePossivel.toLowerCase().includes('reserva') && !nomePossivel.toLowerCase().includes('p.a')) {
                currentPatient = { nome: formatarNomeDinamico(nomePossivel) };
            } else {
                currentPatient = null;
            }
        }

        if (currentPatient && linha.includes('Observa\u00E7\u00E3o:')) {
            let obsText = linha.replace('Observa\u00E7\u00E3o:', '').trim();

            let phoneRegex = /(?:\+?55\s*)?\(?(\d{2})\)?\s*(9?\d{4})[-\s]?(\d{4})/;
            let phoneMatch = obsText.match(phoneRegex);
            let telefoneFormatado = "";
            let telefoneLink = "";
            let obsSemPhone = obsText;
            let erroFixo = false;

            if (phoneMatch) {
                let ddd = phoneMatch[1];
                let pt1 = phoneMatch[2];
                let pt2 = phoneMatch[3];
                
                const isMobile = pt1.length === 5 && pt1.startsWith('9');
                
                if (isMobile) {
                    telefoneFormatado = `(${ddd}) ${pt1}-${pt2}`;
                    telefoneLink = `55${ddd}${pt1}${pt2}`;
                    obsSemPhone = obsText.replace(phoneMatch[0], "");
                } else {
                    telefoneFormatado = `(${ddd}) ${pt1}-${pt2}`;
                    erroFixo = true;
                }
            }

            let timeRegex = /(?<!\d)([0-1]?[0-9]|2[0-3])(?:\s*[hH][sS]?|\s*$|\s*-)/;
            let timeMatch = obsSemPhone.match(timeRegex);
            let horarioStr = "";

            if (timeMatch) {
                let h = parseInt(timeMatch[1], 10);
                if (h >= 0 && h <= 23) {
                    horarioStr = h.toString().padStart(2, '0') + ":00";
                }
            }

            if (telefoneLink && horarioStr && !erroFixo) {
                state.pendentes.push({
                    id: pacId++,
                    nome: currentPatient.nome,
                    horario: horarioStr,
                    telefoneFmt: telefoneFormatado,
                    telefoneLnk: telefoneLink
                });
            } else {
                let motivos = [];
                if (erroFixo) motivos.push(`Telefone Fixo ${telefoneFormatado} (n\u00E3o possui WhatsApp)`);
                else if (!telefoneFormatado) motivos.push("Telefone Ausente");
                if (!horarioStr) motivos.push("Hor\u00E1rio inv\u00E1lido ou ausente");
                
                state.erros.push({
                    id: pacId++,
                    nome: currentPatient.nome,
                    info: motivos.join(' | ')
                });
            }
            currentPatient = null;
        }
    }
    
    if (currentPatient) {
        state.erros.push({
            id: pacId++,
            nome: currentPatient.nome,
            info: "Campo 'Observa\u00E7\u00E3o' ausente no relat\u00F3rio."
        });
    }
}