import React, { useState } from 'react';
import { Task, TimeDiaryEntry } from '../types';
import { storage } from '../services/storage';
import { soundManager } from '../services/sound';
import { CheckSquare, Square, Plus, Trash2, Clock, AlertCircle, Sparkles, BookOpen, ChevronRight, HelpCircle, Flame, PieChart, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  tasks: Task[];
  diary: TimeDiaryEntry[];
  onOpen5sWithTask: (taskTitle: string) => void;
}

export const SmartTasksView: React.FC<Props> = ({ tasks, diary, onOpen5sWithTask }) => {
  const [subTab, setSubTab] = useState<'smart' | 'diary'>('smart');
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New task form state
  const [title, setTitle] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('11:00');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [isMajor, setIsMajor] = useState(true);
  const [category, setCategory] = useState<'foco' | 'delegar' | 'rotina' | 'urgente'>('foco');

  // SMART criteria checks
  const [isSpecific, setIsSpecific] = useState(true);
  const [isMeasurable, setIsMeasurable] = useState(true);
  const [isAttainable, setIsAttainable] = useState(true);
  const [isRelevant, setIsRelevant] = useState(true);

  // Diary form state
  const [isAddingDiary, setIsAddingDiary] = useState(false);
  const [diaryActivity, setDiaryActivity] = useState('');
  const [diaryStart, setDiaryStart] = useState('09:00');
  const [diaryEnd, setDiaryEnd] = useState('10:00');
  const [diaryCategory, setDiaryCategory] = useState<'deep_work' | 'distraction' | 'admin' | 'social' | 'rest'>('deep_work');
  const [diaryProductive, setDiaryProductive] = useState(true);
  const [diaryNotes, setDiaryNotes] = useState('');

  const majorTasks = tasks.filter((t) => t.isMajor);
  const completedMajorTasks = majorTasks.filter((t) => t.completed).length;
  const secondaryTasks = tasks.filter((t) => !t.isMajor);

  const handleToggle = (id: string) => {
    storage.toggleTask(id);
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    }
  };

  const handleDelete = (id: string) => {
    storage.deleteTask(id);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const result = storage.addTask({
      title: title.trim(),
      deadlineTime,
      estimatedMinutes: Number(estimatedMinutes),
      isMajor,
      category,
      isSpecific,
      isMeasurable,
      isAttainable,
      isRelevant,
    });

    if (!result.success) {
      setErrorMessage(result.message || 'Erro ao criar tarefa');
      soundManager.playBeep(250, 0.2);
      return;
    }

    setErrorMessage(null);
    setTitle('');
    setIsCreating(false);
  };

  const handleCreateDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryActivity.trim()) return;

    storage.addDiaryEntry({
      activity: diaryActivity.trim(),
      startTime: diaryStart,
      endTime: diaryEnd,
      category: diaryCategory,
      isProductive: diaryProductive,
      notes: diaryNotes.trim(),
    });

    setDiaryActivity('');
    setDiaryNotes('');
    setIsAddingDiary(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Sub tabs switch */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-2xl border border-slate-800">
        <button
          onClick={() => setSubTab('smart')}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            subTab === 'smart'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Quadro S.M.A.R.T. (Máx 3)
        </button>
        <button
          onClick={() => setSubTab('diary')}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            subTab === 'diary'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Diário de Tempo (Auditoria)
        </button>
      </div>

      {subTab === 'smart' && (
        <>
          {/* Chapter 3 Banner: Max 3 Major Tasks Rule */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg text-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Regra dos 3 Grandes Alvos Diários
              </span>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                {completedMajorTasks}/3 Concluídos
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              De acordo com o <strong>Capítulo 3</strong>, listas com mais de 3 grandes metas sobrecarregam o cérebro e geram paralisia. Vença estas 3 e seu dia foi um triunfo!
            </p>
          </div>

          {/* Quick Create Task Trigger Button */}
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Adicionar Nova Tarefa S.M.A.R.T.</span>
            </button>
          )}

          {/* Create Task Form */}
          {isCreating && (
            <form onSubmit={handleCreateTask} className="p-4 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-xl space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Criar Tarefa no Método S.M.A.R.T.</span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setErrorMessage(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Fechar
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  O que precisa ser feito com precisão?
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Escrever proposta comercial de 3 páginas"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Prazo Estrito (Time-Bound)
                  </label>
                  <input
                    type="time"
                    value={deadlineTime}
                    onChange={(e) => setDeadlineTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Tempo Estimado
                  </label>
                  <select
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value={15}>15 minutos</option>
                    <option value={25}>25 min (1 Pomodoro)</option>
                    <option value={50}>50 min (Sprint Duplo)</option>
                    <option value={90}>90 minutos (Bloco)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Prioridade
                  </label>
                  <select
                    value={isMajor ? 'major' : 'secondary'}
                    onChange={(e) => setIsMajor(e.target.value === 'major')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="major">Grande Alvo do Dia (Máx 3)</option>
                    <option value="secondary">Secundária / Apoio</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Categoria (Eisenhower)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="foco">Foco Profundo</option>
                    <option value="delegar">Delegar para Outro</option>
                    <option value="rotina">Manutenção / Rotina</option>
                    <option value="urgente">Urgência Real</option>
                  </select>
                </div>
              </div>

              {/* SMART Checklist Toggles */}
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Checklist Neurocientífico SMART:
                </span>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSpecific}
                    onChange={(e) => setIsSpecific(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span><strong>Específica (S):</strong> É clara e sem ambiguidade?</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMeasurable}
                    onChange={(e) => setIsMeasurable(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span><strong>Mensurável (M):</strong> Como saberei que acabei com 100% de certeza?</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAttainable}
                    onChange={(e) => setIsAttainable(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span><strong>Atingível (A):</strong> É realista concluir no tempo estipulado?</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRelevant}
                    onChange={(e) => setIsRelevant(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span><strong>Relevante (R):</strong> Serve à sua meta mais importante da vida?</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition"
              >
                SALVAR TAREFA S.M.A.R.T. (+15 XP)
              </button>
            </form>
          )}

          {/* Section: 3 Major Tasks of the Day */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Os 3 Grandes Alvos de Hoje</span>
            </h3>

            {majorTasks.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-400">
                Nenhum alvo principal definido. Escolha até 3 tarefas cruciais para hoje!
              </div>
            ) : (
              majorTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    task.completed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                      : 'bg-slate-900 border-slate-800 text-slate-100 shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => handleToggle(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-amber-400 transition"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.title}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
                        <span className="flex items-center gap-1 text-amber-400 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>Até {task.deadlineTime}</span>
                        </span>
                        <span className="text-slate-400">
                          {task.estimatedMinutes} min
                        </span>
                        <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold ${
                          task.category === 'foco'
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : task.category === 'delegar'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {task.category.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {!task.completed && (
                        <button
                          onClick={() => onOpen5sWithTask(task.title)}
                          className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[10px] font-bold transition"
                          title="Disparar Regra dos 5s para esta tarefa"
                        >
                          🚀 5s
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Section: Secondary Tasks */}
          {secondaryTasks.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Tarefas Secundárias & Apoio
              </h3>
              {secondaryTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-2xl border text-xs ${
                    task.completed
                      ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                      : 'bg-slate-900 border-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <button onClick={() => handleToggle(task.id)}>
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <span className={`flex-1 ${task.completed ? 'line-through text-slate-500' : ''}`}>
                      {task.title}
                    </span>
                    <button onClick={() => handleDelete(task.id)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* SUBTAB: Time Diary (Chapter 8 of the book) */}
      {subTab === 'diary' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-lg">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mb-1">
              <Activity className="w-4 h-4" />
              <span>Diário de Tempo (Capítulo 8)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Você já se pegou pensando "onde foi parar o meu dia?". Registre suas atividades de 1 a 2 horas para auditar quais tarefas geraram valor real e onde tempo foi desperdiçado.
            </p>
          </div>

          {!isAddingDiary ? (
            <button
              onClick={() => setIsAddingDiary(true)}
              className="w-full py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Bloco de Tempo no Diário</span>
            </button>
          ) : (
            <form onSubmit={handleCreateDiary} className="p-4 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Novo Registro no Diário de Tempo</span>
                <button type="button" onClick={() => setIsAddingDiary(false)} className="text-xs text-slate-400">
                  Fechar
                </button>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Atividade realizada:
                </label>
                <input
                  type="text"
                  required
                  value={diaryActivity}
                  onChange={(e) => setDiaryActivity(e.target.value)}
                  placeholder="Ex: Reunião com fornecedor, rolagem no Instagram, relatório..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Início</label>
                  <input
                    type="time"
                    value={diaryStart}
                    onChange={(e) => setDiaryStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Fim</label>
                  <input
                    type="time"
                    value={diaryEnd}
                    onChange={(e) => setDiaryEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Categoria</label>
                  <select
                    value={diaryCategory}
                    onChange={(e) => setDiaryCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="deep_work">Trabalho Profundo</option>
                    <option value="distraction">Distração / Rede Social</option>
                    <option value="admin">Administrativo / E-mails</option>
                    <option value="social">Social / Reunião</option>
                    <option value="rest">Pausa / Descanso</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Produtividade</label>
                  <select
                    value={diaryProductive ? 'yes' : 'no'}
                    onChange={(e) => setDiaryProductive(e.target.value === 'yes')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="yes">Foi Produtivo</option>
                    <option value="no">Tempo Desperdiçado</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs"
              >
                SALVAR NO DIÁRIO (+35 XP)
              </button>
            </form>
          )}

          {/* Diary entries list */}
          <div className="space-y-2">
            {diary.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-400">
                Nenhum bloco registrado hoje. Audite ao menos 3 blocos para entender onde seu tempo vai!
              </div>
            ) : (
              diary.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{entry.activity}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          entry.isProductive
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {entry.isProductive ? 'Produtivo' : 'Distração'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {entry.startTime} às {entry.endTime} • {entry.category.replace('_', ' ')}
                    </p>
                  </div>
                  <button
                    onClick={() => storage.deleteDiaryEntry(entry.id)}
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
    </div>
  );
};
