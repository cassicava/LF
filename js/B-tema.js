function initConfig() {
    const savedTheme = localStorage.getItem('themeLF');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        btnTheme.innerText = '🌙';
    }

    const savedTemplates = localStorage.getItem('templatesLF_v4');
    if (savedTemplates) {
        meusTemplates = JSON.parse(savedTemplates);
    } else {
        meusTemplates = [
            { nome: "Lembrete", texto: templateLembrete },
            { nome: "Remarcar", texto: templateRemarcar }
        ];
        salvarTemplatesLocais();
    }
    
    const savedIndex = localStorage.getItem('templateAtivoLF_v4');
    if (savedIndex !== null && savedIndex < meusTemplates.length) {
        templateAtivoIndex = parseInt(savedIndex);
    } else {
        templateAtivoIndex = 0;
    }
}

// Global para a Interface conseguir acessar a função de salvar
window.salvarTemplatesLocais = function() {
    localStorage.setItem('templatesLF_v4', JSON.stringify(meusTemplates));
    localStorage.setItem('templateAtivoLF_v4', templateAtivoIndex);
}

initConfig();

btnTheme.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('themeLF', 'light');
        btnTheme.innerText = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('themeLF', 'dark');
        btnTheme.innerText = '🌙';
    }
});

// ==========================================
// LÓGICA DA ABA DE CONFIGURAÇÕES (MENSAGENS)
// ==========================================

window.renderizarPilulas = function() {
    templatesRow.innerHTML = '';
    
    meusTemplates.forEach((tpl, index) => {
        const btn = document.createElement('button');
        btn.className = `template-pill ${index === templateAtivoIndex ? 'active' : ''}`;
        btn.innerText = tpl.nome;
        btn.onclick = () => {
            meusTemplates[templateAtivoIndex].texto = msgTemplateInput.value;
            templateAtivoIndex = index;
            window.salvarTemplatesLocais();
            renderizarPilulas(); 
        };
        templatesRow.appendChild(btn);
    });

    if (meusTemplates.length < 3) {
        const btnAdd = document.createElement('button');
        btnAdd.className = 'template-pill template-pill-add';
        btnAdd.innerText = '➕ Adicionar';
        btnAdd.onclick = () => {
            meusTemplates[templateAtivoIndex].texto = msgTemplateInput.value;
            meusTemplates.push({ nome: "Personalizada", texto: "Escreva sua mensagem personalizada aqui..." });
            templateAtivoIndex = meusTemplates.length - 1; 
            window.salvarTemplatesLocais();
            renderizarPilulas();
        };
        templatesRow.appendChild(btnAdd);
    }
    
    msgTemplateInput.value = meusTemplates[templateAtivoIndex].texto;
}

btnSaveConfig.addEventListener('click', () => {
    meusTemplates[templateAtivoIndex].texto = msgTemplateInput.value;
    window.salvarTemplatesLocais();
    
    const textoOriginal = btnSaveConfig.innerText;
    btnSaveConfig.innerText = "Salvo com sucesso! ✔️";
    btnSaveConfig.style.backgroundColor = "var(--gradient-mid)";
    
    setTimeout(() => {
        btnSaveConfig.innerText = textoOriginal;
        btnSaveConfig.style.backgroundColor = "";
    }, 2000);
});

window.copiarTag = function(element) {
    const textoOriginal = element.getAttribute('data-tag') || element.innerText;
    if (!element.getAttribute('data-tag')) {
        element.setAttribute('data-tag', textoOriginal);
    }
    navigator.clipboard.writeText(textoOriginal);
    element.innerText = "Copiado! ✔️";
    setTimeout(() => {
        element.innerText = textoOriginal;
    }, 1000);
}