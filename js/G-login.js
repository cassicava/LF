// A função englobada por () executa imediatamente, prevenindo falhas visuais do F5
(function() {
    const appHeader = document.getElementById('appHeader');
    const headerActions = document.getElementById('headerActions'); // <-- A caixa dos botões
    const loginWrapper = document.getElementById('loginWrapper');
    const floatingTabs = document.getElementById('floatingTabs');
    const appContainer = document.getElementById('appContainer');
    const btnEntrar = document.getElementById('btnEntrar');
    const loginCard = document.querySelector('.login-card');
    
    const inputUsuario = document.getElementById('inputUsuario');
    const inputSenha = document.getElementById('inputSenha');

    const btnTermos = document.getElementById('btnTermos');
    const termosOverlay = document.getElementById('termosOverlay');
    const btnFecharTermos = document.getElementById('btnFecharTermos');
    
    const btnSair = document.getElementById('btnSair');
    const btnConfig = document.getElementById('btnConfig');

    const TEMPO_SESSAO_MINUTOS = 10;
    const now = Date.now();
    const sessaoExpiraEm = localStorage.getItem('lf_sessao_expira');

    // 1. Verifica sessão instantaneamente e força posição para não ter glitch do F5
    if (sessaoExpiraEm && now < parseInt(sessaoExpiraEm)) {
        localStorage.setItem('lf_sessao_expira', now + (TEMPO_SESSAO_MINUTOS * 60 * 1000));
        
        // Desativa a transição momentaneamente
        appHeader.style.transition = 'none';
        headerActions.style.transition = 'none'; // Evita o fade demorado no F5
        
        // Posiciona o cabeçalho e MOSTRA OS BOTÕES
        appHeader.classList.add('move-top', 'header-ready');
        headerActions.classList.add('visible'); // <-- CORREÇÃO AQUI
        
        loginWrapper.style.display = 'none';
        
        if (btnConfig) btnConfig.classList.remove('hide-until-login');
        if (btnSair) btnSair.classList.remove('hide-until-login');

        floatingTabs.classList.remove('app-hidden');
        appContainer.classList.remove('app-hidden');

        // Devolve o direito de animar depois que o navegador pintou a tela
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                appHeader.style.transition = '';
                headerActions.style.transition = '';
            });
        });

    } else {
        // Sem sessão (carregamento inicial da página) - Roda a animação de subir
        setTimeout(() => {
            appHeader.classList.add('move-top');
            setTimeout(() => {
                appHeader.classList.add('header-ready'); 
                headerActions.classList.add('visible'); // <-- CORREÇÃO AQUI TAMBÉM
                loginWrapper.classList.add('visible');
            }, 1200); 
        }, 500); 
    }

    const inputsLogin = loginWrapper.querySelectorAll('input');
    inputsLogin.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                btnEntrar.click();
            }
        });
    });

    // 2. Validação do Login
    btnEntrar.addEventListener('click', (e) => {
        e.preventDefault();
        
        const userDigitado = inputUsuario.value.trim().toLowerCase();
        const senhaDigitada = inputSenha.value.trim();

        const usuarioValido = typeof usuariosHabilitados !== 'undefined' ? usuariosHabilitados.find(
            u => u.usuario === userDigitado && u.senha === senhaDigitada
        ) : null;

        const senhaTem6Digitos = senhaDigitada.length === 6;

        if (usuarioValido && senhaTem6Digitos) {
            localStorage.setItem('lf_sessao_expira', Date.now() + (TEMPO_SESSAO_MINUTOS * 60 * 1000));

            loginWrapper.style.opacity = '0';
            loginWrapper.style.pointerEvents = 'none';
            
            setTimeout(() => {
                loginWrapper.style.display = 'none';
                
                // Exibe os botões de controle suavemente
                if (btnConfig) btnConfig.classList.remove('hide-until-login');
                if (btnSair) btnSair.classList.remove('hide-until-login');

                floatingTabs.classList.remove('app-hidden');
                appContainer.classList.remove('app-hidden');
            }, 600);
        } else {
            loginCard.classList.remove('login-error');
            void loginCard.offsetWidth; 
            loginCard.classList.add('login-error');
        }
    });

    // 3. Ação de Logout
    if (btnSair) {
        btnSair.addEventListener('click', () => {
            localStorage.removeItem('lf_sessao_expira');
            
            floatingTabs.classList.add('app-hidden');
            appContainer.classList.add('app-hidden');
            if (typeof resetarInterface === 'function') resetarInterface(false);

            // Esconde apenas os botões restritos
            if (btnConfig) btnConfig.classList.add('hide-until-login');
            btnSair.classList.add('hide-until-login');

            // Volta apenas o quadro de login, O CABEÇALHO FICA NO TOPO COM TEMA E TERMOS!
            setTimeout(() => {
                loginWrapper.style.display = 'flex';
                void loginWrapper.offsetWidth; 
                loginWrapper.style.opacity = '1';
                loginWrapper.style.pointerEvents = 'auto';
                inputSenha.value = ''; 
            }, 400); 
        });
    }

    // 4. Overlays
    btnTermos.addEventListener('click', () => {
        termosOverlay.classList.add('open');
    });

    btnFecharTermos.addEventListener('click', () => {
        termosOverlay.classList.remove('open');
    });

    termosOverlay.addEventListener('click', (e) => {
        if (e.target === termosOverlay) termosOverlay.classList.remove('open');
    });
})();