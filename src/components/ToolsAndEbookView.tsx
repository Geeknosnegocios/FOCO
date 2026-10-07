import React, { useState } from 'react';
import { EBOOK_CHAPTERS, SAY_NO_SCENARIOS } from '../data/ebookData';
import { storage } from '../services/storage';
import { soundManager } from '../services/sound';
import { MentalThought } from '../types';
import { BookOpen, Shield, Brain, Sparkles, Copy, Check, ChevronDown, ChevronUp, Search, Trash2, Plus, Zap, HeartHandshake } from 'lucide-react';
import { ZenDeclutterArt, VelvetBrickArt } from './VisualIllustrations';
import confetti from 'canvas-confetti';

export const ToolsAndEbookView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ebook' | 'sayno' | 'declutter' | 'missile'>('ebook');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChapter, setExpandedChapter] = useState<number | null>(0);

  // Declutter mind state
  const thoughts = storage.getThoughts();
  const [thoughtInput, setThoughtInput] = useState('');
  const [thoughtType, setThoughtType] = useState<'preocupacao' | 'tarefa' | 'ideia'>('preocupacao');

  // Copy helper
  const handleCopyScript = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    soundManager.playBeep(700, 0.08);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePracticeNo = () => {
    storage.unlockBadgeDirectly('velvet_brick');
    storage.addXp(40, 'Postura Tijolo de Veludo');
    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch {}
  };

  const handleAddThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thoughtInput.trim()) return;
    storage.addThought(thoughtInput.trim(), thoughtType);
    setThoughtInput('');
  };

  const filteredChapters = EBOOK_CHAPTERS.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Sub menu tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded-2xl border border-slate-800 text-[11px] font-bold">
        <button
          onClick={() => setActiveSubTab('ebook')}
          className={`py-2 px-1 rounded-xl transition truncate ${
            activeSubTab === 'ebook' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          📖 Ebook
        </button>
        <button
          onClick={() => setActiveSubTab('sayno')}
          className={`py-2 px-1 rounded-xl transition truncate ${
            activeSubTab === 'sayno' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          🧱 Tijolo Veludo
        </button>
        <button
          onClick={() => setActiveSubTab('declutter')}
          className={`py-2 px-1 rounded-xl transition truncate ${
            activeSubTab === 'declutter' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          🧠 Despejo Mental
        </button>
        <button
          onClick={() => setActiveSubTab('missile')}
          className={`py-2 px-1 rounded-xl transition truncate ${
            activeSubTab === 'missile' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          🎯 Subconsciente
        </button>
      </div>

      {/* SUBTAB 1: EBOOK COMPLETO */}
      {activeSubTab === 'ebook' && (
        <div className="space-y-3">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-white">Guia: Productivity for Procrastinators</h2>
              <p className="text-[11px] text-slate-400">8 Capítulos estruturados para consulta rápida e ação</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30">
              8 Aulas
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por capítulo, método ou técnica..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Chapter cards */}
          <div className="space-y-2.5">
            {filteredChapters.map((chapter) => {
              const isExpanded = expandedChapter === chapter.id;

              return (
                <div
                  key={chapter.id}
                  className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md transition"
                >
                  <button
                    onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                    className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-slate-800/40 transition"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-black border border-indigo-500/30">
                          {chapter.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{chapter.readingTime} de leitura</span>
                      </div>
                      <h3 className="text-xs font-bold text-white leading-snug">{chapter.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{chapter.subtitle}</p>
                    </div>

                    <div className="p-1 rounded-xl bg-slate-800 text-slate-400 shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3 text-xs text-slate-300 animate-fadeIn">
                      <p className="leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                        {chapter.fullSummary}
                      </p>

                      <div>
                        <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                          Pontos-Chave do Ebook:
                        </h4>
                        <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                          {chapter.takeaways.map((point, idx) => (
                            <li key={idx} className="leading-snug">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2">
                          Táticas Práticas Aplicadas:
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {chapter.keyTactics.map((tactic, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                              <span className="font-bold text-white block text-xs">{tactic.title}</span>
                              <span className="text-[11px] text-slate-400">{tactic.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-amber-300">
                          {chapter.actionPrompt}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: TIJOLO DE VELUDO (Capítulo 5) */}
      {activeSubTab === 'sayno' && (
        <div className="space-y-4">
          <VelvetBrickArt />
          <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-950/70 to-slate-900 border border-purple-900/40 text-slate-100 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold border border-purple-500/30">
                Capítulo 5 • Arte de Dizer NÃO
              </span>
              <button
                onClick={handlePracticeNo}
                className="text-xs font-bold text-amber-400 hover:underline"
              >
                + Marcar Prática (+40 XP)
              </button>
            </div>
            <h3 className="text-sm font-extrabold text-white">Técnica do Tijolo de Veludo & Throw It Back</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              <strong>Tijolo de Veludo:</strong> Firme como pedra por dentro, macio como veludo por fora. Dizer não nos primeiros 5 segundos antes que a culpa faça você aceitar.
            </p>
          </div>

          <div className="space-y-3">
            {SAY_NO_SCENARIOS.map((scenario) => (
              <div key={scenario.id} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold uppercase">
                      Alvo: {scenario.target}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1">{scenario.title}</h4>
                    <p className="text-[11px] text-slate-400">{scenario.description}</p>
                  </div>
                </div>

                {/* Velvet script */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-purple-400 uppercase">
                    <span>Script Tijolo de Veludo (Educado e Firme):</span>
                    <button
                      onClick={() => handleCopyScript(scenario.velvetScript, `${scenario.id}-v`)}
                      className="flex items-center gap-1 text-slate-400 hover:text-white"
                    >
                      {copiedId === `${scenario.id}-v` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === `${scenario.id}-v` ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 italic">"{scenario.velvetScript}"</p>
                </div>

                {/* Throw It Back script (if available) */}
                {scenario.throwItBackScript && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 uppercase">
                      <span>Técnica Throw It Back (Devolver o Custo):</span>
                      <button
                        onClick={() => handleCopyScript(scenario.throwItBackScript!, `${scenario.id}-t`)}
                        className="flex items-center gap-1 text-slate-400 hover:text-white"
                      >
                        {copiedId === `${scenario.id}-t` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === `${scenario.id}-t` ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 italic">"{scenario.throwItBackScript}"</p>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-indigo-400" />
                  <span>{scenario.psychologicalTactic}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: DESPEJO MENTAL (Capítulo 8) */}
      {activeSubTab === 'declutter' && (
        <div className="space-y-4">
          <ZenDeclutterArt />
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-md">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-rose-400" />
              <span>Despejo Mental dos 50.000 Pensamentos</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              O livro ensina que o cérebro processa mais de 50 mil pensamentos por dia, a grande maioria inútil ou repetitiva. Descarregue cada pensamento solto para esvaziar a memória RAM cerebral!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAddThought} className="p-3.5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
            <input
              type="text"
              required
              value={thoughtInput}
              onChange={(e) => setThoughtInput(e.target.value)}
              placeholder="Digite qualquer pendência ou preocupação que está na sua cabeça..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {(['preocupacao', 'tarefa', 'ideia'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setThoughtType(t)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold capitalize transition ${
                      thoughtType === t ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Despejar (+15 XP)</span>
              </button>
            </div>
          </form>

          {/* Thought items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 text-xs text-slate-400">
              <span>Pensamentos Descarregados ({thoughts.length}):</span>
              {thoughts.length > 0 && (
                <button
                  onClick={() => storage.clearAllThoughts()}
                  className="text-rose-400 hover:underline text-[11px]"
                >
                  Limpar Todos
                </button>
              )}
            </div>

            {thoughts.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-500">
                Sua mente está limpa! Despeje preocupações para não deixar o cérebro sobrecarregado.
              </div>
            ) : (
              thoughts.map((th) => (
                <div
                  key={th.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize ${
                        th.type === 'preocupacao'
                          ? 'bg-rose-500/20 text-rose-300'
                          : th.type === 'ideia'
                          ? 'bg-sky-500/20 text-sky-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {th.type}
                    </span>
                    <span className="text-slate-200 truncate">{th.text}</span>
                  </div>
                  <button
                    onClick={() => storage.clearThought(th.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 4: MÍSSIL TELEGUIADO & AFIRMAÇÕES (Capítulo 1 - Psycho Cybernetics) */}
      {activeSubTab === 'missile' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-md">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
              Dr. Maxwell Maltz • Psycho-Cybernetics
            </span>
            <h3 className="text-sm font-extrabold text-white mt-1">O Míssil Teleguiado do Subconsciente</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              O cérebro busca o alvo que você programa. Se você pergunta "Por que não consigo?", ele busca limitações. Se você pergunta "Como posso fazer isso em 10 minutos?", ele busca saídas vitoriosas!
            </p>
          </div>

          {/* Empowering questions comparison */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Reprogramação de Perguntas:
            </h4>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 line-through">
                ❌ "Por que eu nunca consigo terminar minhas coisas a tempo?"
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 font-semibold">
                ✅ "O que eu posso executar nos próximos 15 minutos para avançar 1 passo concreto?"
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 line-through">
                ❌ "Por que essa tarefa é tão chata e cansativa?"
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 font-semibold">
                ✅ "Como posso transformar isso em um jogo rápido e liquidar antes das 12h?"
              </div>
            </div>

            {/* Daily Affirmation Card */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-indigo-500/15 border border-amber-500/30 text-center space-y-2">
              <Sparkles className="w-5 h-5 text-amber-400 mx-auto" />
              <p className="text-xs font-extrabold text-white">Afirmação de Poder Diária:</p>
              <p className="text-sm font-semibold text-amber-200 italic">
                "Eu elimino a inércia em 5 segundos. Minhas ações precedem a motivação e meu foco é inabalável."
              </p>
              <button
                onClick={() => {
                  storage.unlockBadgeDirectly('guided_missile');
                  storage.addXp(30, 'Afirmação Subconsciente');
                  soundManager.playSuccess();
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs active:scale-95 transition"
              >
                Declarar e Reprogramar (+30 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
