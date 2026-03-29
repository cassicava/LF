// A função englobada por () executa imediatamente, prevenindo falhas visuais do F5
(function() {
    const loginWrapper = document.getElementById('loginWrapper');
    const appContainer = document.getElementById('appContainer');
    const btnEntrar = document.getElementById('btnEntrar');
    const loginCard = document.querySelector('.login-card');
    
    const inputUsuario = document.getElementById('inputUsuario');
    const inputSenha = document.getElementById('inputSenha');

    const btnTermos = document.getElementById('btnTermos');
    const termosOverlay = document.getElementById('termosOverlay');
    const btnFecharTermos = document.getElementById('btnFecharTermos');
    
    // Header e Actions já são pegos globalmente pelo A-estado.js
    const headerActions = document.getElementById('headerActions'); 
    
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
        headerActions.style.transition = 'none'; 
        
        // Posiciona o cabeçalho, MOSTRA OS BOTÕES e MOVA O TÍTULO (logged-in)
        appHeader.classList.add('move-top', 'header-ready', 'logged-in');
        headerActions.classList.add('visible'); 
        
        loginWrapper.style.display = 'none';
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
                headerActions.classList.add('visible'); 
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
                
                // --- MÁGICA DA PÍLULA NO LOGIN ---
                appHeader.classList.add('logged-in'); // Move título p/ esquerda
                
                // Exibe a mensagem de Bem-vindo
                setTimeout(() => {
                    welcomeMsg.classList.add('show');
                    setTimeout(() => {
                        welcomeMsg.classList.remove('show');
                    }, 2500); // Fica visível por 2.5s e some
                }, 800);

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
            
            appContainer.classList.add('app-hidden');
            if (typeof resetarInterface === 'function') resetarInterface(false);

            // --- VOLTA A PÍLULA AO ESTADO INICIAL ---
            appHeader.classList.remove('logged-in'); // Volta o título pro meio
            headerCenterArea.classList.remove('active'); // Esconde as abas se estiverem abertas

            // Volta apenas o quadro de login
            setTimeout(() => {
                loginWrapper.style.display = 'flex';
                void loginWrapper.offsetWidth; 
                loginWrapper.style.opacity = '1';
                loginWrapper.style.pointerEvents = 'auto';
                inputSenha.value = ''; 
            }, 600); 
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