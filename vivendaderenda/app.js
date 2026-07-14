/**
 * ==========================================================================
 *  SIMULADOR VIVENDO DE RENDA — LÓGICA E RENDERIZAÇÃO
 * ==========================================================================
 *  Não é necessário editar este arquivo para atualizar ativos, pesos, yields
 *  ou datas — isso tudo fica em data.js. Mexa aqui só se quiser mudar o
 *  COMPORTAMENTO da calculadora (a fórmula, a forma como os dados são
 *  agrupados, etc.).
 * ==========================================================================
 */

(function () {
  "use strict";

  const DATA = VIVENDO_DE_RENDA_DATA;
  const PESO_TOLERANCIA = 0.005; // 0,5 p.p. de folga para arredondamento

  // ---- formatação ---------------------------------------------------------

  const fmtBRL = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  const fmtPercent = (v, casas = 1) =>
    v.toLocaleString("pt-BR", { style: "percent", minimumFractionDigits: casas, maximumFractionDigits: casas });

  function parseMoeda(str) {
    const limpo = String(str).replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
    const n = parseFloat(limpo);
    return Number.isFinite(n) ? n : 0;
  }

  // ---- cálculo --------------------------------------------------------------

  /**
   * Réplica da fórmula da planilha (aba Dados, célula L32):
   *   Capital Necessário = Renda / ((1 + yield_anual)^(1/12) - 1)
   * Ou seja: converte o yield anual em yield mensal equivalente e trata o
   * capital como uma perpetuidade que paga a renda mensal desejada.
   */
  function calcular(rendaMensal, perfil) {
    const ativos = DATA.perfis[perfil] || [];
    const somaPesos = ativos.reduce((acc, a) => acc + a.peso, 0);

    const yieldAnual = ativos.reduce((acc, a) => acc + (DATA.yields[a.classe] ?? 0) * a.peso, 0);
    const yieldMensal = Math.pow(1 + yieldAnual, 1 / 12) - 1;
    const capitalNecessario = yieldMensal > 0 ? rendaMensal / yieldMensal : 0;

    const ativosComValor = ativos
      .map((a) => ({ ...a, valor: capitalNecessario * a.peso }))
      .sort((a, b) => b.peso - a.peso);

    const classesMap = new Map();
    for (const a of ativos) {
      const atual = classesMap.get(a.classe) || 0;
      classesMap.set(a.classe, atual + a.peso);
    }
    const classes = DATA.ordemClasses
      .filter((c) => classesMap.has(c))
      .map((c) => ({
        classe: c,
        peso: classesMap.get(c),
        valor: capitalNecessario * classesMap.get(c),
      }));

    return { rendaMensal, perfil, capitalNecessario, yieldAnual, ativos: ativosComValor, classes, somaPesos };
  }

  // ---- validação da config (roda uma vez, ajuda o analista) -----------------

  function validarConfig() {
    for (const perfil of Object.keys(DATA.perfis)) {
      const soma = DATA.perfis[perfil].reduce((acc, a) => acc + a.peso, 0);
      if (Math.abs(soma - 1) > PESO_TOLERANCIA) {
        console.warn(
          `[Vivendo de Renda] Atenção: a soma dos pesos do perfil "${perfil}" é ${(soma * 100).toFixed(1)}%, ` +
            `deveria ser 100%. Confira data.js.`
        );
      }
      for (const a of DATA.perfis[perfil]) {
        if (!(a.classe in DATA.yields)) {
          console.warn(
            `[Vivendo de Renda] Atenção: o ativo "${a.ativo}" (perfil ${perfil}) usa a classe "${a.classe}", ` +
              `que não tem yield definido em data.js -> yields.`
          );
        }
      }
    }
  }

  // ---- render -----------------------------------------------------------

  const el = (id) => document.getElementById(id);

  function renderAviso(resultado) {
    const aviso = el("aviso-soma");
    const foraDaFaixa = Math.abs(resultado.somaPesos - 1) > PESO_TOLERANCIA;
    aviso.hidden = !foraDaFaixa;
    if (foraDaFaixa) {
      aviso.textContent =
        `Atenção (uso interno): a soma dos pesos do perfil "${resultado.perfil}" está em ` +
        `${fmtPercent(resultado.somaPesos, 1)}, deveria ser 100%. Revise o arquivo data.js.`;
    }
  }

  function renderStats(resultado) {
    el("stat-capital").textContent = fmtBRL(resultado.capitalNecessario);
    el("stat-yield").textContent = fmtPercent(resultado.yieldAnual, 2);
    el("stat-renda").textContent = fmtBRL(resultado.rendaMensal);
  }

  function renderBarraClasses(resultado) {
    const barra = el("barra-classes");
    const legenda = el("legenda-classes");
    barra.innerHTML = "";
    legenda.innerHTML = "";

    resultado.classes.forEach((c, i) => {
      const segmento = document.createElement("div");
      segmento.className = "barra-segmento";
      segmento.style.width = `${(c.peso * 100).toFixed(2)}%`;
      segmento.style.setProperty("--cor-classe", `var(--cor-classe-${i})`);
      segmento.title = `${c.classe}: ${fmtPercent(c.peso)}`;
      barra.appendChild(segmento);

      const item = document.createElement("li");
      item.className = "legenda-item";
      item.innerHTML = `
        <span class="legenda-swatch" style="--cor-classe: var(--cor-classe-${i})"></span>
        <span class="legenda-nome">${c.classe}</span>
        <span class="legenda-valor">${fmtPercent(c.peso)}</span>
      `;
      legenda.appendChild(item);
    });
  }

  function renderTabelaClasses(resultado) {
    const tbody = el("tabela-classes-corpo");
    tbody.innerHTML = "";
    resultado.classes.forEach((c, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="legenda-swatch" style="--cor-classe: var(--cor-classe-${i})"></span>${c.classe}</td>
        <td class="col-numero">${fmtPercent(c.peso)}</td>
        <td class="col-numero">${fmtBRL(c.valor)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderTabelaAtivos(resultado) {
    const tbody = el("tabela-ativos-corpo");
    tbody.innerHTML = "";

    const porClasse = new Map();
    resultado.ativos.forEach((a) => {
      if (!porClasse.has(a.classe)) porClasse.set(a.classe, []);
      porClasse.get(a.classe).push(a);
    });

    DATA.ordemClasses
      .filter((c) => porClasse.has(c))
      .forEach((classe, i) => {
        const trGrupo = document.createElement("tr");
        trGrupo.className = "linha-grupo";
        trGrupo.innerHTML = `<td colspan="3"><span class="legenda-swatch" style="--cor-classe: var(--cor-classe-${i})"></span>${classe}</td>`;
        tbody.appendChild(trGrupo);

        porClasse.get(classe).forEach((a) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td class="col-ativo">${a.ativo}</td>
            <td class="col-numero">${fmtPercent(a.peso)}</td>
            <td class="col-numero">${fmtBRL(a.valor)}</td>
          `;
          tbody.appendChild(tr);
        });
      });
  }

  function render(resultado) {
    renderAviso(resultado);
    renderStats(resultado);
    renderBarraClasses(resultado);
    renderTabelaClasses(resultado);
    renderTabelaAtivos(resultado);
  }

  // ---- interação ----------------------------------------------------------

  let perfilAtual = "Agressivo";

  function recalcular() {
    const renda = parseMoeda(el("input-renda").value) || 0;
    const resultado = calcular(renda, perfilAtual);
    render(resultado);
  }

  function selecionarPerfil(perfil) {
    perfilAtual = perfil;
    document.querySelectorAll(".perfil-botao").forEach((btn) => {
      btn.classList.toggle("is-ativo", btn.dataset.perfil === perfil);
      btn.setAttribute("aria-pressed", btn.dataset.perfil === perfil ? "true" : "false");
    });
    recalcular();
  }

  function iniciar() {
    validarConfig();

    el("atualizacao").textContent = DATA.atualizacao;

    document.querySelectorAll(".perfil-botao").forEach((btn) => {
      btn.addEventListener("click", () => selecionarPerfil(btn.dataset.perfil));
    });

    const inputRenda = el("input-renda");
    inputRenda.addEventListener("change", recalcular);
    inputRenda.addEventListener("blur", () => {
      const valor = parseMoeda(inputRenda.value);
      inputRenda.value = valor.toLocaleString("pt-BR");
      recalcular();
    });
    inputRenda.addEventListener("keydown", (e) => {
      if (e.key === "Enter") inputRenda.blur();
    });

    selecionarPerfil(perfilAtual);
  }

  document.addEventListener("DOMContentLoaded", iniciar);
})();
