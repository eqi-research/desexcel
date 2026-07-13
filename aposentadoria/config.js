// ==========================================================================
// Configuração da Calculadora de Salário na Aposentadoria
// --------------------------------------------------------------------------
// LOGGER_URL: URL do Google Apps Script Web App que recebe os logs.
// Aponta pro mesmo backend usado pela calculadora de imóveis (uma planilha
// só recebe logs de todas as ferramentas — o campo "Tool" distingue).
// Ver SETUP_GOOGLE_SHEETS.md na raiz do repositório.
// ==========================================================================
window.DESEXCEL_CONFIG = {
  LOGGER_URL: 'https://script.google.com/macros/s/AKfycbwThPJ6_sH7kCYQuteMaAHmmm7EtTrn5p-nGBw-k_XEp2rsrNW5M5crDYnu3c95-LY7/exec',
  TOOL_ID:    'aposentadoria'
};
