import React, { useState } from 'react';
import { soundManager } from '../services/sound';
import { storage } from '../services/storage';
import { Bot, Sparkles, X, Rocket, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { NandoBananaMascot } from './NandoBananaMascot';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLaunch5sWithTask: (taskName: string) => void;
}

interface CoachResponse {
  title: string;
  mindsetQuote: string;
  microSteps: string[];
  velvetScript?: string;
  xpBonus: number;
}

export const AICoachModal: React.FC<Props> = ({ isOpen, onClose, onLaunch5sWithTask }) => {
  const [taskDesc, setTaskDesc] = useState('');
  const [hesitation, setHesitation] = useState('A tarefa parece grande e complexa demais');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoachResponse | null>(null);

  if (!isOpen) return null;

  const handleAskCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDesc.trim()) return;

    setLoading(true);
    soundManager.playBeep(520, 0.08);

    try {
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskDescription: taskDesc,
          hesitationReason: hesitation,
          context: 'Aplicativo FocoTotal PWA',
        }),
      });

      const data = await res.json();
      setResult(data);
      storage.addXp(25, 'Consulta com Coach IA');
      soundManager.playSuccess();
    } catch {
      // Fallback
      setResult({
        title: 'Micro-Quebra Anti-Inércia',
        mindsetQuote: 'O cérebro busca autopreservação através da preguiça. Conte 5-4-3-2-1 e mova os dedos.',
        microSteps: [
          '1. Abra o arquivo ou documento e escreva apenas 1 frase imperfeita.',
          '2. Coloque o cronômetro Pomodoro em 10 minutos.',
          '3. Ignore a busca por perfeição agora: feito é melhor que perfeito.',
        ],
        velvetScript: 'Estou focado em uma entrega estrita e retorno logo em seguida.',
        xpBonus: 25,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-indigo-500/40 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <NandoBananaMascot size="sm" animated={false} />
          <div>
            <h2 className="text-base font-extrabold text-white">Nando Banana & Coach IA</h2>
            <p className="text-[11px] text-indigo-300">Inteligência Neurocientífica Anti-Inércia</p>
          </div>
        </div>

        {!result ? (
          <form onSubmit={handleAskCoach} className="space-y-3.5">
            <p className="text-xs text-slate-300 leading-relaxed">
              Diga o que você está procrastinando e o motivo da hesitação. O Coach usará a <strong>Regra dos 5s</strong> e a <strong>simplificação radical</strong> para destravar sua mente.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-200 block mb-1">
                Qual tarefa você está adiando?
              </label>
              <input
                type="text"
                required
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Ex: Terminar apresentação para o cliente..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-200 block mb-1">
                Qual desculpa sua mente está usando?
              </label>
              <select
                value={hesitation}
                onChange={(e) => setHesitation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-400"
              >
                <option value="A tarefa parece grande e complexa demais">A tarefa parece grande e complexa demais</option>
                <option value="Medo de não ficar perfeito ou ser criticado">Perfeccionismo / Medo de falhar</option>
                <option value="Cansaço aparente ou falta de vontade">Sensação de preguiça / Cansaço</option>
                <option value="Distração com redes sociais e celular">Distrações externas e celular</option>
                <option value="Dúvida sobre por onde começar">Não sei qual é o primeiro passo</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Analisando padrões neurocientíficos...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>DESTRAVAR MINHA INÉRCIA AGORA</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Diagnóstico do Coach:
              </span>
              <h3 className="font-extrabold text-white text-sm mb-1">{result.title}</h3>
              <p className="italic text-slate-300 text-[11px]">"{result.mindsetQuote}"</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>3 Micro-Passos Imediatos:</span>
              </h4>
              <div className="space-y-2">
                {result.microSteps.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {result.velvetScript && (
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-[10px] font-bold uppercase text-purple-400 block mb-0.5">
                  Blindagem Tijolo de Veludo:
                </span>
                <p className="text-slate-300 italic text-[11px]">"{result.velvetScript}"</p>
              </div>
            )}

            <button
              onClick={() => {
                onClose();
                onLaunch5sWithTask(taskDesc);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-rose-500/25 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4 text-amber-200" />
              <span>DISPARAR REGRA DOS 5 SEGUNDOS AGORA!</span>
            </button>

            <button
              onClick={() => setResult(null)}
              className="w-full text-center text-xs text-slate-400 hover:text-white"
            >
              Consultar outra tarefa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
