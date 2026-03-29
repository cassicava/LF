pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const appHeader = document.getElementById('appHeader');
const welcomeMsg = document.getElementById('welcomeMsg');
const headerCenterArea = document.getElementById('headerCenterArea');
const appContainer = document.getElementById('appContainer'); 

const dropZone = document.getElementById('dropZone');
const contentArea = document.getElementById('contentArea'); // Lista de Pacientes
const configContainer = document.getElementById('configContainer'); // Editor de Mensagens
const dropTitle = document.getElementById('dropTitle');
const dropSubtitle = document.getElementById('dropSubtitle');
const btnExcluir = document.getElementById('btnExcluir');
const floatingTabs = document.getElementById('floatingTabs');
const tabBtns = document.querySelectorAll('.tab-btn');
const activeBg = document.getElementById('activeBg');
const mouseShadow = document.getElementById('mouseShadow');
const appTitle = document.getElementById('appTitle');

const btnTheme = document.getElementById('btnTheme');

const templatesRow = document.getElementById('templatesRow');
const btnSaveConfig = document.getElementById('btnSaveConfig');
const msgTemplateInput = document.getElementById('msgTemplateInput');

let state = {
    medicoNome: "",
    medicoEspecialidade: "",
    medicoGenero: "", 
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

const wDocM = '👨🏻‍⚕️';
const wDocF = '👩🏼‍⚕️';

const templateLembrete = "Ol\xE1, *{{nome}}* \uD83D\uDC4B\n\nLEMBRETE DE CONSULTA:\n\n\uD83D\uDCC5 Data: *{{data}}*\n\u23F0 Hor\xE1rio: *{{horario}}*\n{{emoji_medico}} Profissional: *{{medico}}*\n\nInforma\xE7\xF5es importantes:\n\n\u2022 Menores de idade: \xE9 obrigat\xF3rio o comparecimento com um respons\xE1vel legal.\n\u2022 Idosos: recomenda-se a presen\xE7a de um acompanhante.\n\u2022 Exames: traga todos, inclusive de outras unidades.\n\u2022 Primeira consulta: \xE9 necess\xE1rio apresentar o encaminhamento m\xE9dico (se houver).\n\nEm caso de d\xFAvidas ou necessidade de reagendamento, entre em contato conosco.\nAguardamos voc\xEA! \uD83D\uDE42";

const templateRemarcar = "Ol\xE1, *{{nome}}* \uD83D\uDC4B\n\nSua consulta com *{{medico}}* do dia *{{data}}* precisou ser reagendada.\n\nMotivo: [Escreva o motivo aqui]\n\nNovo agendamento:\n\uD83D\uDCC5 Data: [Nova Data]\n\u23F0 Hor\xE1rio: [Novo Hor\xE1rio]\n\nQualquer d\xFAvida, estamos \xE0 disposi\xE7\xE3o.";

let meusTemplates = [];
let templateAtivoIndex = 0;