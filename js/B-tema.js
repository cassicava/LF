function initConfig() {
    const savedTheme = localStorage.getItem('themeLF');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        btnTheme.innerText = '🌙';
    }

    const savedMsg = localStorage.getItem('msgTemplateLF_v3');
    if (!savedMsg) {
        localStorage.setItem('msgTemplateLF_v3', templatePadrao);
    }
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

btnConfig.addEventListener('click', () => {
    msgTemplateInput.value = localStorage.getItem('msgTemplateLF_v3') || templatePadrao;
    configModal.classList.add('active');
});

btnCancelConfig.addEventListener('click', () => {
    configModal.classList.remove('active');
});

btnSaveConfig.addEventListener('click', () => {
    localStorage.setItem('msgTemplateLF_v3', msgTemplateInput.value);
    configModal.classList.remove('active');
});

window.copiarTag = function(element) {
    // 1. Armazena a tag original na primeira vez que for clicada
    const textoOriginal = element.getAttribute('data-tag') || element.innerText;
    
    if (!element.getAttribute('data-tag')) {
        element.setAttribute('data-tag', textoOriginal);
    }

    // 2. Copia o texto original, ignorando se estiver escrito "Copiado!"
    navigator.clipboard.writeText(textoOriginal);
    
    element.innerText = "Copiado! ✔️";
    setTimeout(() => {
        element.innerText = textoOriginal;
    }, 1000);
}