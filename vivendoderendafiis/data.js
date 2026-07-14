/**
 * ==========================================================================
 *  SIMULADOR VIVENDO DE RENDA COM FIIS — DADOS EDITÁVEIS
 * ==========================================================================
 *  Este é o ÚNICO arquivo que o analista precisa editar para atualizar a
 *  carteira recomendada de FIIs (novo fundo, novo peso, novo DY, nova data).
 *  Não é necessário mexer em index.html, style.css ou app.js.
 *
 *  Depois de editar, salve o arquivo e recarregue a página no navegador.
 * ==========================================================================
 */

const VIVENDO_DE_RENDA_FIIS_DATA = {

  // Mês/ano de referência da carteira recomendada (aparece no topo da página)
  atualizacao: "Maio 2026",

  /**
   * Carteira recomendada de FIIs (perfil único: Investidor Imobiliário).
   *
   * Cada linha é um fundo:
   *   nome  — nome fantasia do fundo (aparece na tabela)
   *   ticker — código de negociação (ex: "MANA11")
   *   setor  — setor do fundo (usado para agrupar o gráfico/tabela de setores;
   *            use sempre o mesmo texto para o mesmo setor, ex: sempre
   *            "Logística", nunca variar "Logistica"/"logística")
   *   peso   — fração do PATRIMÔNIO TOTAL alocada nesse fundo (não é % do
   *            setor, é % do total da carteira)
   *   dy     — dividend yield anual esperado do fundo, em fração
   *            (0.14 = 14% a.a.)
   *
   * IMPORTANTE: a soma de todos os pesos abaixo deve dar 1 (100%). A página
   * calcula essa soma automaticamente e mostra um aviso visível se não bater
   * — confira esse aviso depois de editar.
   *
   * Para adicionar um fundo: copie uma linha, troque nome/ticker/setor/peso/dy.
   * Para remover um fundo: apague a linha inteira.
   */
  fiis: [
    { nome: "Manatê Multiestratégia",        ticker: "MANA11", setor: "Multiestratégia", peso: 0.075, dy: 0.14042553191 },
    { nome: "BTG CRI",                       ticker: "BTCI11", setor: "Papel",           peso: 0.10,  dy: 0.12298728813 },
    { nome: "BTG Logística",                 ticker: "BTLG11", setor: "Logística",       peso: 0.10,  dy: 0.091506756757 },
    { nome: "TRX Real Estate FII",           ticker: "TRXF11", setor: "Híbrido",         peso: 0.05,  dy: 0.13012340238 },
    { nome: "Hedge Brasil Shopping",         ticker: "HGBS11", setor: "Shopping",        peso: 0.075, dy: 0.09121785541 },
    { nome: "Pátria Renda Urbana",           ticker: "HGRU11", setor: "Híbrido",         peso: 0.05,  dy: 0.094239246086 },
    { nome: "RBR Log",                       ticker: "RBRL11", setor: "Logística",       peso: 0.05,  dy: 0.1067535545 },
    { nome: "Rio Bravo Renda Corporativa",   ticker: "RCRB11", setor: "Escritórios",     peso: 0.05,  dy: 0.075309344332 },
    { nome: "Pátria Escritórios",            ticker: "HGRE11", setor: "Escritórios",     peso: 0.05,  dy: 0.096784144367 },
    { nome: "Pátria VBI Logística",          ticker: "LVBI11", setor: "Logística",       peso: 0.075, dy: 0.08337193145 },
    { nome: "RBR Crédito Estruturado",       ticker: "RBRY11", setor: "Papel",           peso: 0.075, dy: 0.15216216216 },
    { nome: "Mauá Real Estate",              ticker: "MCRE11", setor: "Multiestratégia", peso: 0.075, dy: 0.13594232749 },
    { nome: "Vectis Juro Real",              ticker: "VCJR11", setor: "Papel",           peso: 0.10,  dy: 0.13999248026 },
    { nome: "XP Malls",                      ticker: "XPML11", setor: "Shopping",        peso: 0.075, dy: 0.099227035772 },
  ],

  /**
   * Ordem fixa dos setores — usada para cores do gráfico e ordem de exibição.
   * Se adicionar um fundo de um setor novo, inclua o nome do setor aqui
   * também (e uma cor em style.css, variável --cor-setor-N).
   */
  ordemSetores: ["Papel", "Multiestratégia", "Logística", "Escritórios", "Shopping", "Híbrido"],

};
