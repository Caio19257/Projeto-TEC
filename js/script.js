(function () {
    "use strict";

    const LOGIN_PAGE = "login.html";
    const HOME_PAGE = "index.html";
    const SESSION_KEY = "bugfarm_usuario_logado";

    function nomeDaPaginaAtual() {
        const caminho = window.location.pathname;
        return caminho.substring(caminho.lastIndexOf("/") + 1);
    }

    function usuarioEstaLogado() {
        return sessionStorage.getItem(SESSION_KEY) === "true";
    }

    function estaNaPaginaDeLogin() {
        return nomeDaPaginaAtual() === LOGIN_PAGE;
    }

    function protegerPagina() {
        if (!estaNaPaginaDeLogin() && !usuarioEstaLogado()) {
            window.location.replace(LOGIN_PAGE);
        }
    }

    function entrar(email) {
        sessionStorage.setItem(SESSION_KEY, "true");
        sessionStorage.setItem("bugfarm_usuario_email", email);
        window.location.replace(HOME_PAGE);
    }

    function sair() {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem("bugfarm_usuario_email");
        window.location.replace(LOGIN_PAGE);
    }

    window.BugFarmAuth = {
        entrar,
        sair,
        usuarioEstaLogado
    };

    protegerPagina();
})();
