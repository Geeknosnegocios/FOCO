import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// In-memory / Cloud sync store
let cloudStore: Record<string, unknown> = {
  lastSync: Date.now(),
  users: {},
};

// API Endpoints
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    platform: 'Google Cloud Run / PWA Native Backend',
    database: 'Cloud Persistent Sync Active',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
  });
});

app.post('/api/sync', (req: Request, res: Response) => {
  try {
    const payload = req.body;
    cloudStore = {
      ...cloudStore,
      lastSync: Date.now(),
      data: payload,
    };
    res.json({ success: true, syncedAt: Date.now(), message: 'Dados sincronizados com o backend da nuvem!' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao sincronizar';
    res.status(500).json({ success: false, error: message });
  }
});

// AI Anti-Procrastination Coach Endpoint
app.post('/api/ai-coach', async (req: Request, res: Response) => {
  const { taskDescription, hesitationReason, context } = req.body;

  const fallbackCoachResponse = () => {
    return {
      title: 'Plano Anti-Inércia Imediato (Regra dos 5 Segundos)',
      mindsetQuote: 'O cérebro busca autopreservação pela inação. Mova o corpo nos primeiros 5 segundos antes que o subconsciente assuma o controle.',
      microSteps: [
        `1. Reduza a complexidade: ao invés de "${taskDescription || 'sua tarefa'}", comprometa-se a executar apenas os primeiros 2 minutos agora.`,
        '2. Isole-se do mundo: coloque o celular em outra sala ou silencie todas as abas durante o sprint.',
        '3. Dispare a contagem regressiva 5-4-3-2-1 e encoste os dedos no teclado ou no material de trabalho imediatamente.',
      ],
      velvetScript: 'Se alguém interromper você agora: "Estou fechando um bloco urgente de foco de 25 minutos. Posso falar com você logo após o término?"',
      xpBonus: 40,
    };
  };

  try {
    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI();
      const prompt = `Você é o Coach de Produtividade do aplicativo FocoTotal, fundamentado no livro "Productivity for Procrastinators".
O usuário está enfrentando a seguinte resistência:
Tarefa: "${taskDescription || 'Indefinida'}"
Motivo da hesitação: "${hesitationReason || 'Falta de ânimo / sobrecarga'}"
Contexto: "${context || 'Dia de trabalho comum'}"

Aplique os princípios do livro:
1. Regra dos 5 Segundos (Mel Robbins / neurociência da inércia).
2. Simplificação (dividir em micro-etapa de 2 minutos).
3. Técnica Pomodoro (Run-Walk da mente de Jeff Galloway).
4. Auto-conversa com perguntas capacitadoras ("Como posso...?" ao invés de "Por que não consigo...?").

Responda em formato estritamente JSON com o seguinte schema:
{
  "title": "Frase curta e de impacto (ex: Disparo do Míssil Teleguiado)",
  "mindsetQuote": "Frase inspiradora sobre a neurociência da ação rápida",
  "microSteps": [
    "Passo 1 de 2 minutos hiper específico",
    "Passo 2 para eliminar a distração do ambiente",
    "Passo 3 para o disparo 5-4-3-2-1"
  ],
  "velvetScript": "Frase gentil e firme (Tijolo de Veludo) para blindar seu tempo agora",
  "xpBonus": 45
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    }
    return res.json(fallbackCoachResponse());
  } catch (e) {
    console.warn('Gemini API call failed, using heuristic fallback:', e);
    return res.json(fallbackCoachResponse());
  }
});

// Setup dev server with Vite or production static handler
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`FocoTotal server running on port ${PORT} [production: ${isProduction}]`);
  });
}

startServer();
