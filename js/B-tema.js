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
    const texto = element.innerText;
    navigator.clipboard.writeText(texto);
    const originalText = element.innerText;
    element.innerText = "Copiado! \u2714\uFE0F";
    setTimeout(() => {
        element.innerText = originalText;
    }, 1000);
}