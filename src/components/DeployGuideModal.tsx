import React, { useState } from 'react';
import { X, Copy, Check, Cloud, Terminal, Smartphone, Sparkles, Server, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../services/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    soundManager.playBeep(650, 0.08);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '1. Testar e Gerar o Build de Produção',
      desc: 'No terminal da sua máquina ou ambiente Cloud Shell, execute a compilação completa:',
      code: 'npm install\nnpm run build',
    },
    {
      title: '2. Login e Seleção do Projeto Google Cloud',
      desc: 'Autentique sua conta do Google e aponte para seu projeto no Google Cloud:',
      code: 'gcloud auth login\ngcloud config set project SEU_ID_DE_PROJETO_AQUI',
    },
    {
      title: '3. Publicar no Google Cloud Run (1 Comando)',
      desc: 'O Cloud Run compilará o servidor Express (porta 3000) e servirá o PWA estático e os endpoints com SSL gratuito:',
      code: 'gcloud run deploy focototal-app \\\n  --source . \\\n  --region us-central1 \\\n  --port 3000 \\\n  --allow-unauthenticated',
    },
    {
      title: '4. Injetar a Chave da API Gemini (Opcional para IA)',
      desc: 'Adicione sua chave secreta da API Gemini para ativar o Coach com IA em tempo real:',
      code: 'gcloud run services update focototal-app \\\n  --set-env-vars GEMINI_API_KEY="SUA_CHAVE_GEMINI_AQUI"',
    },
    {
      title: '5. Distribuir e Instalar no Celular (PWA)',
      desc: 'Ao finalizar o deploy, o Google Cloud Run fornecerá uma URL HTTPS segura (ex: https://focototal-app-xyz.a.run.app). Ao abrir essa URL no celular, toque em "Instalar App" para tê-lo na tela inicial como app nativo!',
      code: null,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Guia de Publicação no Google Cloud</h2>
            <p className="text-xs text-emerald-300">Deploy Full-Stack Backend + PWA Nativo</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 mb-4 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-white mb-1">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Arquitetura Pronta para Produção</span>
          </div>
          Seu software está 100% configurado com <strong>Node.js + Express (porta 3000)</strong> servindo tanto as APIs REST (`/api/sync`, `/api/ai-coach`, `/api/health`) quanto o aplicativo PWA instalado.
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{step.title}</span>
              </h3>
              <p className="text-[11px] text-slate-300 leading-snug">{step.desc}</p>

              {step.code && (
                <div className="relative">
                  <pre className="p-2.5 rounded-xl bg-slate-950 text-[10px] text-emerald-300 font-mono overflow-x-auto border border-slate-800">
                    {step.code}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(step.code!, idx)}
                    className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Copiar comando"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20"
        >
          ENTENDIDO, VOLTAR AO APLICATIVO
        </button>
      </div>
    </div>
  );
};
