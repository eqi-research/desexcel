/**
 * ==========================================================================
 *  SIMULADOR VIVENDO DE RENDA — DADOS EDITÁVEIS
 * ==========================================================================
 *  Este é o ÚNICO arquivo que o analista precisa editar para atualizar a
 *  calculadora (novos ativos, novos pesos, novo yield, nova data). Não é
 *  necessário mexer em index.html, style.css ou app.js.
 *
 *  Depois de editar, salve o arquivo e recarregue a página no navegador.
 * ==========================================================================
 */

const VIVENDO_DE_RENDA_DATA = {

  // Mês/ano de referência da carteira recomendada (aparece no topo da página)
  atualizacao: "Junho 2026",

  /**
   * Dividend yield anual esperado por classe de ativo (em fração: 0.081 = 8,1% a.a.)
   * Fonte: EQI Research. Usado para calcular o yield médio da carteira e o
   * capital necessário para gerar a renda desejada.
    */
  yields: {
    "Renda Fixa": 0.081,
    "FIIs":       0.117,
    "FI-Infras":  0.117,
    "Ações":      0.102,
  },

  /**
   * Ordem fixa das classes de ativo — usada para cores do gráfico e para a
   * ordem de exibição nas tabelas. Se adicionar uma classe nova, inclua o
   * nome dela aqui também (e uma cor em style.css, variável --cor-classe-N).
   */
  ordemClasses: ["Renda Fixa", "FIIs", "FI-Infras", "Ações"],

  /**
   * Carteira recomendada por perfil de investidor.
   *
   * Cada ativo tem um "peso": a fração do PATRIMÔNIO TOTAL alocada naquele
   * ativo para aquele perfil (não é % dentro da classe, é % do total).
   *
   * IMPORTANTE: dentro de cada perfil, a soma de todos os pesos deve dar 1
   * (100%). A página calcula essa soma automaticamente e mostra um aviso
   * visível se não bater — confira esse aviso depois de editar.
   *
   * Para adicionar um ativo: copie uma linha, troque classe/ativo/peso.
   * Para remover um ativo: apague a linha inteira.
   * A classe deve ser exatamente um dos nomes usados em "yields" acima.
   */
  perfis: {

    Conservador: [
      { classe: "Renda Fixa", ativo: "IPCA+ 2037 com Juros Semestrais",       peso: 0.35 },
      { classe: "Renda Fixa", ativo: "IPCA+ 2045 com Juros Semestrais",       peso: 0.05 },
      { classe: "Renda Fixa", ativo: "Pré-fixado 2037 com Juros Semestrais",  peso: 0.23 },
      { classe: "FIIs",       ativo: "VCJR11",  peso: 0.34 / 7 },
      { classe: "FIIs",       ativo: "BTLG11",  peso: 0.34 / 7 },
      { classe: "FIIs",       ativo: "HGRE11",  peso: 0.34 / 7 },
      { classe: "FIIs",       ativo: "KNCR11",  peso: 0.34 / 7 },
      { classe: "FIIs",       ativo: "HGBS11",  peso: 0.34 / 7 },
      { classe: "FIIs",       ativo: "MANA11",  peso: 0.34 / 7 },
      { classe: "FIIs",       ativo: "RBVA11",  peso: 0.34 / 7 },
      { classe: "FI-Infras",  ativo: "BODB11",  peso: 0.03 },
    ],

    Moderado: [
      { classe: "Renda Fixa", ativo: "IPCA+ 2037 com Juros Semestrais",       peso: 0.19 },
      { classe: "Renda Fixa", ativo: "IPCA+ 2045 com Juros Semestrais",       peso: 0.08 },
      { classe: "Renda Fixa", ativo: "Pré-fixado 2037 com Juros Semestrais",  peso: 0.28 },
      { classe: "FIIs",       ativo: "VCJR11",  peso: 0.24 / 7 },
      { classe: "FIIs",       ativo: "BTLG11",  peso: 0.24 / 7 },
      { classe: "FIIs",       ativo: "HGRE11",  peso: 0.24 / 7 },
      { classe: "FIIs",       ativo: "KNCR11",  peso: 0.24 / 7 },
      { classe: "FIIs",       ativo: "HGBS11",  peso: 0.24 / 7 },
      { classe: "FIIs",       ativo: "MANA11",  peso: 0.24 / 7 },
      { classe: "FIIs",       ativo: "RBVA11",  peso: 0.24 / 7 },
      { classe: "FI-Infras",  ativo: "BODB11",  peso: 0.03 },
      { classe: "Ações",      ativo: "PETR4",   peso: 0.18 / 10 },
      { classe: "Ações",      ativo: "ITSA4",   peso: 0.18 / 10 },
      { classe: "Ações",      ativo: "KLBN11",  peso: 0.18 / 10 },
      { classe: "Ações",      ativo: "ALOS3",   peso: 0.18 / 10 },
      { classe: "Ações",      ativo: "BBSE3",   peso: 0.18 / 10 },
      { classe: "Ações",      ativo: "SAUD3",   peso: 0.18 / 10 },
      { classe: "Ações",      ativo: "VULC3",   peso: 0.18 / 10 },
      { classe: "Ações",      ativo: "ALUP11",  peso: 0.18 / 10 },
      { classe: "Ações",      ativo: "AXIA3",   peso: 0.18 / 10 },
      { classe: "Ações",      ativo: "FLRY3",   peso: 0.18 / 10 },
    ],

    Agressivo: [
      { classe: "Renda Fixa", ativo: "IPCA+ 2037 com Juros Semestrais",       peso: 0.12 },
      { classe: "Renda Fixa", ativo: "IPCA+ 2045 com Juros Semestrais",       peso: 0.09 },
      { classe: "Renda Fixa", ativo: "Pré-fixado 2037 com Juros Semestrais",  peso: 0.18 },
      { classe: "FIIs",       ativo: "VCJR11",  peso: 0.33 / 7 },
      { classe: "FIIs",       ativo: "BTLG11",  peso: 0.33 / 7 },
      { classe: "FIIs",       ativo: "HGRE11",  peso: 0.33 / 7 },
      { classe: "FIIs",       ativo: "KNCR11",  peso: 0.33 / 7 },
      { classe: "FIIs",       ativo: "HGBS11",  peso: 0.33 / 7 },
      { classe: "FIIs",       ativo: "MANA11",  peso: 0.33 / 7 },
      { classe: "FIIs",       ativo: "RBVA11",  peso: 0.33 / 7 },
      { classe: "FI-Infras",  ativo: "BODB11",  peso: 0.03 },
      { classe: "Ações",      ativo: "PETR4",   peso: 0.25 / 10 },
      { classe: "Ações",      ativo: "ITSA4",   peso: 0.25 / 10 },
      { classe: "Ações",      ativo: "KLBN11",  peso: 0.25 / 10 },
      { classe: "Ações",      ativo: "ALOS3",   peso: 0.25 / 10 },
      { classe: "Ações",      ativo: "BBSE3",   peso: 0.25 / 10 },
      { classe: "Ações",      ativo: "SAUD3",   peso: 0.25 / 10 },
      { classe: "Ações",      ativo: "VULC3",   peso: 0.25 / 10 },
      { classe: "Ações",      ativo: "ALUP11",  peso: 0.25 / 10 },
      { classe: "Ações",      ativo: "AXIA3",   peso: 0.25 / 10 },
      { classe: "Ações",      ativo: "FLRY3",   peso: 0.25 / 10 },
    ],

  },

};
