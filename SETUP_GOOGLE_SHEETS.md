# Setup do logging via Google Sheets

Este passo a passo configura o backend de registro dos cálculos. Você só precisa fazer **uma vez**. Depois disso, todo cálculo da calculadora vira uma linha numa planilha do Google que só você acessa.

> **Tempo estimado:** 10 minutos.
> **Custo:** zero (cota gratuita do Google Apps Script — mais que suficiente).

---

## 1. Criar a planilha

1. Abra https://sheets.google.com e crie uma planilha em branco.
2. Renomeie ela para `desexcel · logs` (ou outro nome que preferir).
3. Renomeie a primeira aba para `Logs` (clique com o botão direito na aba "Página1" → Renomear).

Você **não precisa** criar cabeçalhos — o Apps Script cria automaticamente na primeira execução.

---

## 2. Colar o Apps Script

1. Ainda dentro da planilha, no menu superior: **Extensões → Apps Script**.
2. Vai abrir um editor com um arquivo `Code.gs` contendo `function myFunction() {}`. **Apague tudo** e cole o código abaixo:

```javascript
// ============================================================
// desexcel · logger — recebe POSTs da calculadora e grava linhas
// ============================================================
const SHEET_NAME = 'Logs';

const HEADERS = [
  'Timestamp servidor', 'Timestamp cliente', 'Tool', 'Session ID',
  'Valor Imóvel', 'Aluguel Mensal',
  'IPCA', 'Spread IPCA+', 'CDI', 'Prefixado', 'Alíquota IR',
  'Aluguel Líq.', 'Renda Anual', 'Valorização', 'Total Imóvel',
  'CDB Rend. Ano', 'IPCA+ Rend. Ano', 'Prefixado Rend. Ano',
  'User Agent', 'Idioma', 'Origem'
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      data.timestamp || '',
      data.tool || '',
      data.sessionId || '',
      data.valorImovel || 0,
      data.aluguel || 0,
      data.ipca || 0,
      data.spreadIpca || 0,
      data.cdi || 0,
      data.prefixado || 0,
      data.aliq || 0,
      data.aluguelLiq || 0,
      data.rendaAnual || 0,
      data.valorizacao || 0,
      data.totalImovel || 0,
      data.cdbRendAno || 0,
      data.ipcaRendAno || 0,
      data.preRendAno || 0,
      data.userAgent || '',
      data.lang || '',
      data.origem || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('desexcel logger v1 — online');
}
```

3. Aperte **Ctrl+S** (ou o ícone de disquete) pra salvar. Dê um nome ao projeto, tipo `desexcel-logger`.

---

## 3. Publicar como Web App

1. No editor do Apps Script, clique em **Implantar → Nova implantação** (canto superior direito).
2. Em **Tipo**, clique na engrenagem ⚙️ e selecione **App da Web**.
3. Preencha:
   - **Descrição:** `desexcel logger v1`
   - **Executar como:** `Eu (seu-email@gmail.com)`
   - **Quem pode acessar:** **Qualquer pessoa** *(precisa ser "Qualquer pessoa" pra a calculadora hospedada no GitHub conseguir enviar — ninguém vê os dados, só você na planilha)*
4. Clique em **Implantar**.
5. Vai pedir autorização — clique em **Autorizar acesso**, escolha sua conta Google, e em **Avançado → Acessar [nome do projeto]**.
6. Quando terminar, **copie a URL** que aparece em "URL do app da Web". Vai ser algo tipo:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

---

## 4. Colar a URL no `config.js`

1. Abra o arquivo [`imoveisxrendafixa/config.js`](./imoveisxrendafixa/config.js).
2. Substitua `COLE_AQUI_A_URL_DO_APPS_SCRIPT` pela URL que você copiou:
   ```js
   window.DESEXCEL_CONFIG = {
     LOGGER_URL: 'https://script.google.com/macros/s/AKfycb.../exec',
     TOOL_ID:    'imoveisxrendafixa'
   };
   ```
3. Commit e push:
   ```bash
   git add imoveisxrendafixa/config.js
   git commit -m "Configura URL do logger"
   git push
   ```

---

## 5. Testar

1. Abra a calculadora no navegador (ou em https://eqi-research.github.io/desexcel/imoveisxrendafixa/ se já estiver publicada).
2. Preencha os valores e clique em **Calcular**.
3. Embaixo do botão, deve aparecer "● Cálculo registrado" por alguns segundos.
4. Abra a planilha — deve ter uma linha nova com os dados do cálculo.

Se aparecer "● Falha ao registrar", veja a seção [Troubleshooting](#troubleshooting) abaixo.

---

## Atualizando o código do Apps Script

Se você precisar mudar algo no `Code.gs` depois:

1. Edite o código no Apps Script.
2. **Implantar → Gerenciar implantações** → clique no lápis ✏️ ao lado da implantação ativa.
3. Em **Versão**, escolha **Nova versão**.
4. Clique em **Implantar**.

A URL continua a mesma. Se você criar uma **nova implantação** em vez de atualizar, a URL muda e o `config.js` precisa ser atualizado.

---

## Troubleshooting

**Aparece "Falha ao registrar" no navegador**
- Verifique se a URL no `config.js` está correta (termina em `/exec`).
- Verifique se na publicação você escolheu "Quem pode acessar: Qualquer pessoa" (não "Qualquer pessoa com a conta Google").

**A planilha não recebe os dados**
- Abra o Apps Script → menu lateral **Execuções**. Veja se há erros recentes.
- Verifique se a aba se chama exatamente `Logs` (com L maiúsculo).

**Limites de uso**
- A cota gratuita do Apps Script é de ~20.000 chamadas por dia. Pra essa calculadora, é mais que suficiente.

---

## Segurança e privacidade

- A URL do Apps Script fica visível no código-fonte da calculadora (qualquer um que ver a página pode encontrar). Isso é normal nesse padrão.
- O que um terceiro pode fazer com a URL: enviar POSTs (poluir a planilha com dados falsos). Não consegue ler a planilha.
- Os dados registrados são **anônimos**: sem nome, sem email, sem IP. Apenas inputs/resultados de cálculo + user agent.
- Você (dono da planilha) é o **único que vê** o conteúdo.
