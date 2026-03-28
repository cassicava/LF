pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const dropZone = document.getElementById('dropZone');
const contentArea = document.getElementById('contentArea');
const dropTitle = document.getElementById('dropTitle');
const dropSubtitle = document.getElementById('dropSubtitle');
const btnExcluir = document.getElementById('btnExcluir');
const floatingTabs = document.getElementById('floatingTabs');
const tabBtns = document.querySelectorAll('.tab-btn');
const activeBg = document.getElementById('activeBg');
const mouseShadow = document.getElementById('mouseShadow');
const appTitle = document.getElementById('appTitle');

const btnTheme = document.getElementById('btnTheme');
const btnConfig = document.getElementById('btnConfig');
const configModal = document.getElementById('configModal');
const btnCancelConfig = document.getElementById('btnCancelConfig');
const btnSaveConfig = document.getElementById('btnSaveConfig');
const msgTemplateInput = document.getElementById('msgTemplateInput');

let state = {
    medicoNome: "",
    medicoEspecialidade: "",
    dataConsulta: "",
    pendentes: [],
    enviados: [],
    erros: []
};

let abaAtual = 'pendentes';
let processInterval;
let esperandoVoltaConfete = false;
let hasDocument = false;

let clicksNeeded = Math.floor(Math.random() * 11) + 10;
let currentClicks = 0;

const wDocM = '\uD83D\uDC68\u200D\u2695\uFE0F';
const wDocF = '\uD83D\uDC69\u200D\u2695\uFE0F';

const templatePadrao = "Ol\xE1, *{{nome}}* \uD83D\uDC4B\n\nLEMBRETE DE CONSULTA:\n\n\uD83D\uDCC5 Data: *{{data}}*\n\u23F0 Hor\xE1rio: *{{horario}}*\n{{emoji_medico}} Profissional: *{{medico}}*\n\nInforma\xE7\xF5es importantes:\n\n\u2022 Menores de idade: \xE9 obrigat\xF3rio o comparecimento com um respons\xE1vel legal.\n\u2022 Idosos: recomenda-se a presen\xE7a de um acompanhante.\n\u2022 Exames: traga todos, inclusive de outras unidades.\n\u2022 Primeira consulta: \xE9 necess\xE1rio apresentar o encaminhamento m\xE9dico (se houver).\n\nEm caso de d\xFAvidas ou necessidade de reagendamento, entre em contato conosco.\nAguardamos voc\xEA! \uD83D\uDE42";