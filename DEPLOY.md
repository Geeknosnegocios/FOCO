# Como Publicar o FocoTotal no Google Cloud Run

Este projeto é uma aplicação full-stack **Progressive Web App (PWA)** com backend em **Express (Node.js)** e frontend **React + Tailwind CSS** construída com Vite.

## 1. Pré-requisitos
- Conta no [Google Cloud Platform](https://cloud.google.com/)
- [Google Cloud CLI (gcloud)](https://cloud.google.com/sdk/docs/install) instalado
- Node.js 20+

---

## 2. Passo a Passo de Publicação no Google Cloud Run

### Passo 1: Fazer login no Google Cloud
Abra o terminal no diretório do projeto e execute:
```bash
gcloud auth login
```

### Passo 2: Selecionar o seu projeto
```bash
gcloud config set project SEU_ID_DE_PROJETO_AQUI
```

### Passo 3: Habilitar o Cloud Run e Cloud Build (se primeira vez)
```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

### Passo 4: Fazer o Deploy direto com 1 comando
O Cloud Run detectará o `package.json` e o `server.ts`, fará o build e criará o container automaticamente:
```bash
gcloud run deploy focototal-app \
  --source . \
  --region us-central1 \
  --port 3000 \
  --allow-unauthenticated
```

### Passo 5: Configurar Variáveis de Ambiente (Chave Gemini)
Para que o Coach Anti-Inércia com IA responda com a inteligência do Gemini:
```bash
gcloud run services update focototal-app \
  --set-env-vars GEMINI_API_KEY="SUA_CHAVE_GEMINI_AQUI" \
  --region us-central1
```

---

## 3. Como Instalar no Celular (PWA)
1. Acesse no navegador do celular a URL HTTPS gerada pelo Google Cloud Run (ex: `https://focototal-app-xxxx.a.run.app`).
2. **No Android (Chrome)**: Toque no botão "Instalar App" ou no menu dos 3 pontos > "Instalar aplicativo".
3. **No iPhone (Safari)**: Toque no botão "Compartilhar" (quadrado com seta para cima) > "Adicionar à Tela de Início".
4. O aplicativo funcionará em tela cheia com ícone nativo e suporte offline!
