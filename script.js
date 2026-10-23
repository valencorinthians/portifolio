/* =========================================================
   PORTFÓLIO DE VALENTINA — interações em JavaScript puro
   Cada função tem uma responsabilidade específica.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const documentoHtml = document.documentElement;
  const botaoTema = document.getElementById("botao-tema");
  const botaoMenu = document.getElementById("botao-menu");
  const navegacao = document.getElementById("navegacao");
  const botaoTopo = document.getElementById("botao-topo");
  const textoDigitado = document.getElementById("texto-digitado");
  const anoAtual = document.getElementById("ano-atual");
  const elementosAnimados = document.querySelectorAll(".aparecer");
  const prefereMovimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Atualiza o ícone, o texto acessível e a cor do navegador conforme o tema.
  function atualizarBotaoTema(tema) {
    const temaClaro = tema === "claro";
    botaoTema.innerHTML = temaClaro
      ? '<i class="bi bi-moon-stars" aria-hidden="true"></i><span class="texto-tema">Tema escuro</span>'
      : '<i class="bi bi-sun" aria-hidden="true"></i><span class="texto-tema">Tema claro</span>';
    botaoTema.setAttribute("aria-label", temaClaro ? "Ativar tema escuro" : "Ativar tema claro");

    const metaTema = document.querySelector('meta[name="theme-color"]');
    if (metaTema) {
      metaTema.setAttribute("content", temaClaro ? "#fff6fc" : "#170d1a");
    }
  }

  // Alterna entre os temas claro e escuro.
  function alternarTema() {
    const temaAtual = documentoHtml.getAttribute("data-tema");
    const novoTema = temaAtual === "escuro" ? "claro" : "escuro";
    documentoHtml.setAttribute("data-tema", novoTema);
    try { window.localStorage.setItem("portfolio-tema", novoTema); } catch (erro) { /* armazenamento pode estar bloqueado */ }
    atualizarBotaoTema(novoTema);
  }

  let temaInicial = documentoHtml.getAttribute("data-tema") || "escuro";
  try {
    const temaSalvo = window.localStorage.getItem("portfolio-tema");
    if (temaSalvo === "claro" || temaSalvo === "escuro") temaInicial = temaSalvo;
  } catch (erro) { /* armazenamento pode estar bloqueado */ }
  documentoHtml.setAttribute("data-tema", temaInicial);
  botaoTema.addEventListener("click", alternarTema);
  atualizarBotaoTema(temaInicial);

  // Abre e fecha o menu de navegação em telas pequenas.
  function fecharMenu() {
    navegacao.classList.remove("aberta");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu de navegação");
  }

  botaoMenu.addEventListener("click", function () {
    const menuEstaAberto = navegacao.classList.toggle("aberta");
    botaoMenu.setAttribute("aria-expanded", String(menuEstaAberto));
    botaoMenu.setAttribute("aria-label", menuEstaAberto ? "Fechar menu de navegação" : "Abrir menu de navegação");
  });

  navegacao.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", fecharMenu);
  });

  // Fecha o menu se a janela for ampliada para o layout de computador.
  window.addEventListener("resize", function () {
    if (window.innerWidth > 680) {
      fecharMenu();
    }
  });

  // Exibe o botão de voltar ao topo apenas depois de rolar a página.
  function atualizarBotaoTopo() {
    if (window.scrollY > 420) {
      botaoTopo.classList.add("visivel");
    } else {
      botaoTopo.classList.remove("visivel");
    }
  }

  window.addEventListener("scroll", atualizarBotaoTopo, { passive: true });
  atualizarBotaoTopo();

  botaoTopo.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: prefereMovimentoReduzido ? "auto" : "smooth"
    });
  });

  // Escreve e apaga frases no título principal, como uma máquina de escrever.
  function iniciarEfeitoDigitacao() {
    if (!textoDigitado || prefereMovimentoReduzido) {
      return;
    }

    const frases = [
      "Estudante de Desenvolvimento Full Stack",
      "Aprendendo Front-end",
      "Criando projetos com código"
    ];
    let indiceFrase = 0;
    let indiceLetra = frases[0].length;
    let apagando = false;

    function atualizarTexto() {
      const fraseAtual = frases[indiceFrase];

      if (apagando) {
        indiceLetra -= 1;
      } else {
        indiceLetra += 1;
      }

      textoDigitado.textContent = fraseAtual.substring(0, indiceLetra);

      let intervalo = apagando ? 38 : 75;

      if (!apagando && indiceLetra === fraseAtual.length) {
        apagando = true;
        intervalo = 1500;
      } else if (apagando && indiceLetra === 0) {
        apagando = false;
        indiceFrase = (indiceFrase + 1) % frases.length;
        intervalo = 350;
      }

      window.setTimeout(atualizarTexto, intervalo);
    }

    // A primeira frase já aparece no HTML; começa apagando ao final da pausa.
    window.setTimeout(function () {
      apagando = true;
      atualizarTexto();
    }, 1700);
  }

  iniciarEfeitoDigitacao();

  // Revela os elementos conforme eles entram na área visível da tela.
  function iniciarAnimacoesDeEntrada() {
    if (prefereMovimentoReduzido || !("IntersectionObserver" in window)) {
      elementosAnimados.forEach(function (elemento) {
        elemento.classList.add("visivel");
      });
      return;
    }

    const observador = new IntersectionObserver(function (entradas, observadorAtual) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observadorAtual.unobserve(entrada.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    });

    elementosAnimados.forEach(function (elemento) {
      observador.observe(elemento);
    });
  }

  iniciarAnimacoesDeEntrada();

  // Mantém o ano do rodapé atualizado automaticamente.
  if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
  }

});
