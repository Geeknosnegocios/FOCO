import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2 } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<Props> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, show small subtle badge or hide
  if (isInstalled) {
    if (compact) return null;
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>App Instalado</span>
      </div>
    );
  }

  // Chromium / Android / Desktop prompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 font-medium rounded-xl transition shadow-md active:scale-95 ${
          compact
            ? 'px-3 py-1.5 text-xs bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold shadow-amber-500/20'
            : 'px-4 py-2.5 text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold hover:brightness-110 shadow-amber-500/25'
        }`}
      >
        <Download className="w-4 h-4 animate-bounce" />
        <span>Instalar App Nativo</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-2 font-medium rounded-xl transition border border-indigo-400/30 active:scale-95 ${
            compact
              ? 'px-2.5 py-1 text-xs bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25'
              : 'px-3.5 py-2 text-xs bg-indigo-600/20 text-indigo-200 hover:bg-indigo-600/30'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          <span>Instalar no iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 flex items-center justify-center border border-indigo-500/40">
                    <Smartphone className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Instalar no iPhone / iPad</h3>
                    <p className="text-xs text-slate-400">Funciona como aplicativo nativo</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 my-4 text-sm text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <Share2 className="w-5 h-5 text-sky-400 mt-0.5 shrink-0" />
                  <p>
                    1. No navegador Safari, toque no ícone de <strong>Compartilhar</strong> (quadrado com seta para cima).
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <PlusSquare className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <p>
                    2. Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <p>
                    3. Toque em <strong>Adicionar</strong> no canto superior direito. Pronto!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full mt-2 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-sm transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
