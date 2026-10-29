// esse Storage serve para salvar as chaves de entrada do site
const STORAGE_KEYS = {
    USER: 'bugfarm_user_session'
};

window.STORAGE_KEYS = STORAGE_KEYS;

// Função global de Logout alterada, agora essa bomba funciona
function logout() {
    const userKey = STORAGE_KEYS.USER || "user";
    localStorage.removeItem(userKey);
    localStorage.removeItem("user"); 
    window.location.replace("login.html");
}document.addEventListener('DOMContentLoaded', () => {
  const tabelaLotes = document.getElementById('tabelaLotes');
  if (tabelaLotes) {
  }
});
const STORAGE_KEYS = {
    LOTES: 'bugfarm_lotes',
    MONITORAMENTO: 'bugfarm_monitoramento',
    ALIMENTACAO: 'bugfarm_alimentacao',
    USER: 'bugfarm_user'
};

const DEFAULT_LOTES = [
    { id: 'L-2023-01', especie: 'Grilo-Doméstico (Acheta domesticus)', estufa: 'Estufa Alpha', dataEclosao: '2023-09-01', quantidadeKg: 150.0, status: 'Ativo' },
    { id: 'L-2023-02', especie: 'Tenébrio-Comum (Tenebrio molitor)', estufa: 'Estufa Beta', dataEclosao: '2023-10-10', quantidadeKg: 80.5, status: 'Ativo' },
    { id: 'L-2023-03', especie: 'Grilo-Preto (Gryllus bimaculatus)', estufa: 'Estufa Gamma', dataEclosao: '2023-08-15', quantidadeKg: 210.0, status: 'Ativo' }
];

const DEFAULT_MONITORAMENTO = [
    { loteId: 'L-2023-01', data: '2023-10-10', temp: 26.5, umidade: 65 },
    { loteId: 'L-2023-01', data: '2023-10-11', temp: 26.8, umidade: 64 },
    { loteId: 'L-2023-01', data: '2023-10-12', temp: 27.0, umidade: 66 },
    { loteId: 'L-2023-01', data: '2023-10-13', temp: 25.9, umidade: 62 },
    { loteId: 'L-2023-01', data: '2023-10-14', temp: 26.2, umidade: 63 },
    { loteId: 'L-2023-01', data: '2023-10-15', temp: 27.1, umidade: 65 },
    { loteId: 'L-2023-01', data: '2023-10-16', temp: 26.4, umidade: 61 },
    { loteId: 'L-2023-01', data: '2023-10-17', temp: 25.8, umidade: 60 },
    { loteId: 'L-2023-01', data: '2023-10-18', temp: 26.0, umidade: 63 },
    { loteId: 'L-2023-01', data: '2023-10-19', temp: 26.7, umidade: 64 },
    { loteId: 'L-2023-02', data: '2023-10-10', temp: 22.0, umidade: 70 },
    { loteId: 'L-2023-02', data: '2023-10-11', temp: 23.5, umidade: 68 },
    { loteId: 'L-2023-02', data: '2023-10-12', temp: 24.0, umidade: 69 },
    { loteId: 'L-2023-02', data: '2023-10-13', temp: 21.5, umidade: 72 },
    { loteId: 'L-2023-02', data: '2023-10-14', temp: 22.8, umidade: 71 },
    { loteId: 'L-2023-02', data: '2023-10-15', temp: 23.0, umidade: 70 },
    { loteId: 'L-2023-02', data: '2023-10-16', temp: 24.1, umidade: 68 },
    { loteId: 'L-2023-02', data: '2023-10-17', temp: 23.9, umidade: 67 },
    { loteId: 'L-2023-02', data: '2023-10-18', temp: 22.5, umidade: 69 },
    { loteId: 'L-2023-02', data: '2023-10-19', temp: 23.2, umidade: 70 }
];

const DEFAULT_ALIMENTACAO = [
    { loteId: 'L-2023-01', data: '2023-10-19', tipo: 'Ração Protéica A2', quantidadeKg: 12.5, resp: 'Carlos (Técnico)' },
    { loteId: 'L-2023-02', data: '2023-10-19', tipo: 'Substrato de Trigo', quantidadeKg: 8.0, resp: 'Ana (Sanitarista)' }
];

function getStorageData(key, fallback) {
    const data = localStorage.getItem(key);
    if (!data) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
    }
    return JSON.parse(data);
}

function saveStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

let lotesData = getStorageData(STORAGE_KEYS.LOTES, DEFAULT_LOTES);
let monitoramentoData = getStorageData(STORAGE_KEYS.MONITORAMENTO, DEFAULT_MONITORAMENTO);
let alimentacaoData = getStorageData(STORAGE_KEYS.ALIMENTACAO, DEFAULT_ALIMENTACAO);

function checkAuth() {
    const currentUser = localStorage.getItem(STORAGE_KEYS.USER);
    const path = window.location.pathname.toLowerCase();
    const isLoginPage = path.endsWith('login.html');

    if (!currentUser && !isLoginPage) {
        window.location.href = 'login.html';
    } else if (currentUser && isLoginPage) {
        window.location.href = 'index.html';
    }
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    window.location.href = 'login.html';
}

function calcularDiasEclosao(dataEclosaoStr) {
    const dataEclosao = new Date(dataEclosaoStr);
    const hoje = new Date();
    const diffTime = Math.abs(hoje - dataEclosao);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function calcularMediaTemp10Dias(loteId) {
    const leituras = monitoramentoData
        .filter(m => m.loteId === loteId)
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 10);

    if (leituras.length === 0) return 0;
    const soma = leituras.reduce((acc, curr) => acc + parseFloat(curr.temp), 0);
    return (soma / leituras.length).toFixed(1);
}

function validarElegibilidadeColheita(lote) {
    const dias = calcularDiasEclosao(lote.dataEclosao);
    const mediaTemp = parseFloat(calcularMediaTemp10Dias(lote.id));

    const atendeDias = dias >= 45;
    const atendeTemp = mediaTemp >= 25.0;

    return {
        elegivel: atendeDias && atendeTemp,
        diasCalculados: dias,
        mediaTempCalculada: mediaTemp,
        atendeDias: atendeDias,
        atendeTemp: atendeTemp,
        motivos: [
            !atendeDias ? `Necessário 45 dias de ciclo (Atual: ${dias} dias).` : null,
            !atendeTemp ? `Média térmica de 10 dias insuficiente (Atual: ${mediaTemp}°C | Min: 25.0°C). Risco Biológico!` : null
        ].filter(Boolean)
    };
}

function toggleModal(modalId, show = true) {
    const modal = document.getElementById(modalId);
    if (modal) {
        if (show) modal.classList.add('active');
        else modal.classList.remove('active');
    }
}

checkAuth();