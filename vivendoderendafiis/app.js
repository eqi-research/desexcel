/**
 * ==========================================================================
 *  SIMULADOR VIVENDO DE RENDA COM FIIS — LÓGICA E RENDERIZAÇÃO
 * ==========================================================================
 *  Não é necessário editar este arquivo para atualizar fundos, pesos, DYs
 *  ou a data — isso tudo fica em data.js. Mexa aqui só se quiser mudar o
 *  COMPORTAMENTO da calculadora.
 * ==========================================================================
 */

(function () {
  "use strict";

  const DATA = VIVENDO_DE_RENDA_FIIS_DATA;
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
   * Capital Necessário = Renda / ((1 + yield_anual)^(1/12) - 1)
   * yield_anual da carteira = soma(peso_i * DY_i) de cada FII (SUMPRODUCT).
   */
  function calcular(rendaMensal) {
    const fiis = DATA.fiis;
    const somaPesos = fiis.reduce((acc, f) => acc + f.peso, 0);

    const yieldAnual = fiis.reduce((acc, f) => acc + f.peso * f.dy, 0);
    const yieldMensal = Math.pow(1 + yieldAnual, 1 / 12) - 1;
    const capitalNecessario = yieldMensal > 0 ? rendaMensal / yieldMensal : 0;

    const dyMax = Math.max(...fiis.map((f) => f.dy));

    const fiisComValor = fiis
      .map((f) => ({ ...f, valor: capitalNecessario * f.peso }))
      .sort((a, b) => b.peso - a.peso);

    const setoresMap = new Map();
    for (const f of fiis) {
      const atual = setoresMap.get(f.setor) || 0;
      setoresMap.set(f.setor, atual + f.peso);
    }
    const setores = DATA.ordemSetores
      .filter((s) => setoresMap.has(s))
      .map((s) => ({
        setor: s,
        peso: setoresMap.get(s),
        valor: capitalNecessario * setoresMap.get(s),
      }));

    return { rendaMensal, capitalNecessario, yieldAnual, fiis: fiisComValor, setores, somaPesos, dyMax };
  }

  // ---- validação da config (roda uma vez, ajuda o analista) -----------------

  function validarConfig() {
    const soma = DATA.fiis.reduce((acc, f) => acc + f.peso, 0);
    if (Math.abs(soma - 1) > PESO_TOLERANCIA) {
      console.warn(
        `[Vivendo de Renda com FIIs] Atenção: a soma dos pesos é ${(soma * 100).toFixed(1)}%, ` +
          `deveria ser 100%. Confira data.js.`
      );
    }
    for (const f of DATA.fiis) {
      if (!DATA.ordemSetores.includes(f.setor)) {
        console.warn(
          `[Vivendo de Renda com FIIs] Atenção: o fundo "${f.ticker}" usa o setor "${f.setor}", ` +
            `que não está em data.js -> ordemSetores.`
        );
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
        `Atenção (uso interno): a soma dos pesos da carteira está em ` +
        `${fmtPercent(resultado.somaPesos, 1)}, deveria ser 100%. Revise o arquivo data.js.`;
    }
  }

  function renderStats(resultado) {
    el("stat-capital").textContent = fmtBRL(resultado.capitalNecessario);
    el("stat-yield").textContent = fmtPercent(resultado.yieldAnual, 2);
    el("stat-renda").textContent = fmtBRL(resultado.rendaMensal);
  }

  function renderBarraSetores(resultado) {
    const barra = el("barra-setores");
    const legenda = el("legenda-setores");
    barra.innerHTML = "";
    legenda.innerHTML = "";

    resultado.setores.forEach((s, i) => {
      const segmento = document.createElement("div");
      segmento.className = "barra-segmento";
      segmento.style.width = `${(s.peso * 100).toFixed(2)}%`;
      segmento.style.setProperty("--cor-setor", `var(--cor-setor-${i})`);
      segmento.title = `${s.setor}: ${fmtPercent(s.peso)}`;
      barra.appendChild(segmento);

      const item = document.createElement("li");
      item.className = "legenda-item";
      item.innerHTML = `
        <span class="legenda-swatch" style="--cor-setor: var(--cor-setor-${i})"></span>
        <span class="legenda-nome">${s.setor}</span>
        <span class="legenda-valor">${fmtPercent(s.peso)}</span>
      `;
      legenda.appendChild(item);
    });
  }

  function renderTabelaSetores(resultado) {
    const tbody = el("tabela-setores-corpo");
    tbody.innerHTML = "";
    resultado.setores.forEach((s, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="legenda-swatch" style="--cor-setor: var(--cor-setor-${i})"></span>${s.setor}</td>
        <td class="col-numero">${fmtPercent(s.peso)}</td>
        <td class="col-numero">${fmtBRL(s.valor)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderTabelaFiis(resultado) {
    const tbody = el("tabela-fiis-corpo");
    tbody.innerHTML = "";

    resultado.fiis.forEach((f) => {
      const tr = document.createElement("tr");
      const larguraBarra = resultado.dyMax > 0 ? (f.dy / resultado.dyMax) * 100 : 0;
      tr.innerHTML = `
        <td class="col-ativo">${f.nome}</td>
        <td>${f.ticker}</td>
        <td>${f.setor}</td>
        <td class="col-numero">${fmtPercent(f.peso)}</td>
        <td class="col-numero">${fmtBRL(f.valor)}</td>
        <td class="col-dy">
          <div class="dy-barra-fundo"><div class="dy-barra" style="width:${larguraBarra}%"></div></div>
          <span class="dy-valor">${fmtPercent(f.dy, 2)}</span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function render(resultado) {
    renderAviso(resultado);
    renderStats(resultado);
    renderBarraSetores(resultado);
    renderTabelaSetores(resultado);
    renderTabelaFiis(resultado);
  }

  // ---- interação ----------------------------------------------------------

  function recalcular() {
    const renda = parseMoeda(el("input-renda").value) || 0;
    render(calcular(renda));
  }

  function iniciar() {
    validarConfig();

    el("atualizacao").textContent = DATA.atualizacao;

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

    recalcular();
  }

  document.addEventListener("DOMContentLoaded", iniciar);
})();
