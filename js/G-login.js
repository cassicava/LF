document.addEventListener('DOMContentLoaded', () => {
    const appHeader = document.getElementById('appHeader');
    const headerActions = document.getElementById('headerActions');
    const loginWrapper = document.getElementById('loginWrapper');
    const floatingTabs = document.getElementById('floatingTabs');
    const appContainer = document.getElementById('appContainer');
    const btnEntrar = document.getElementById('btnEntrar');
    
    const btnTermos = document.getElementById('btnTermos');
    const termosOverlay = document.getElementById('termosOverlay');
    const btnFecharTermos = document.getElementById('btnFecharTermos');

    // 1. Coreografia da Animação Inicial
    setTimeout(() => {
        appHeader.classList.add('move-top');
        setTimeout(() => {
            appHeader.classList.add('header-ready'); 
            headerActions.classList.add('visible');
            loginWrapper.classList.add('visible');
        }, 1200); 
    }, 500); 

    // 2. Ação de Entrar (Login)
    btnEntrar.addEventListener('click', (e) => {
        e.preventDefault();
        
        loginWrapper.style.opacity = '0';
        loginWrapper.style.pointerEvents = 'none';
        
        setTimeout(() => {
            loginWrapper.style.display = 'none';
            
            // Re-exibe o ícone de Configuração de mensagens (📧)
            const btnConfig = document.getElementById('btnConfig');
            if (btnConfig) btnConfig.classList.remove('hide-until-login');

            floatingTabs.classList.remove('app-hidden');
            appContainer.classList.remove('app-hidden');
        }, 600);
    });

    // 3. Lógica do Overlay de Termos
    btnTermos.addEventListener('click', () => {
        termosOverlay.classList.add('open');
    });

    btnFecharTermos.addEventListener('click', () => {
        termosOverlay.classList.remove('open');
    });

    termosOverlay.addEventListener('click', (e) => {
        if (e.target === termosOverlay) termosOverlay.classList.remove('open');
    });
});