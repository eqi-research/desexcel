# desexcel

Versões web (HTML/JS, sem build) de planilhas Excel usadas pela EQI Research. Identidade visual baseada no EQI Brand Book v1.0.

Acesso público: https://eqi-research.github.io/desexcel/ *(precisa habilitar GitHub Pages — ver instruções abaixo).*

---

## Estrutura

```
desexcel/
├── index.html                          ← landing: lista de ferramentas
├── imoveisxrendafixa/
│   ├── index.html                      ← a calculadora
│   └── config.js                       ← URL do logger (Google Apps Script)
├── SETUP_GOOGLE_SHEETS.md              ← passo a passo do backend de logs
└── README.md
```

Convenção pra novas ferramentas: `desexcel/<nomedaferramenta>/index.html`. Link na landing aponta pra `./<nomedaferramenta>/`.

---

## Ferramentas

### 01. Calculadora de Imóveis x Renda Fixa
[`imoveisxrendafixa/`](./imoveisxrendafixa/)

Compara a rentabilidade de um imóvel alugado com 3 opções de renda fixa (CDB 100% CDI, IPCA+10%, Prefixado 18% a.a.). Considera a Tabela Regressiva do IR sobre o aluguel e alíquota de 17,5% pra renda fixa acima de 360 dias.

**Recursos:**
- Premissas editáveis (IPCA, CDI, spread, prefixado, alíquota)
- Botão "Calcular" — disparo explícito
- Exportação dos resultados em PDF (via `html2pdf.js`)
- Registro automático de cada cálculo num Google Sheets (anônimo)

---

## Logging

Toda vez que alguém clica em **Calcular**, é enviado um POST com os inputs, premissas e resultados pra um Apps Script Web App, que grava uma linha numa Google Sheet privada.

- Setup: ver [`SETUP_GOOGLE_SHEETS.md`](./SETUP_GOOGLE_SHEETS.md) (10 min, uma vez).
- Enquanto a URL do logger não estiver configurada em `config.js`, a calculadora funciona normalmente — só não registra.
- Dados coletados são anônimos (sem PII).

---

## Publicar no GitHub Pages

1. Repositório no GitHub → **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Branch: `main`, pasta: `/ (root)`. Salvar.
4. Aguardar ~1 min. A URL fica em `https://eqi-research.github.io/desexcel/`.

---

## Rodar localmente

Basta abrir `index.html` no navegador. Sem build, sem servidor.

Pra testar o logging localmente, abra a página via servidor estático (não `file://`), por exemplo:
```bash
python -m http.server 8000
# acesse http://localhost:8000/
```
