import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ThumbsUp, ThumbsDown, Zap, Send, Dumbbell, Target, Trophy, BarChart, RefreshCw } from 'lucide-react';
import { Foco, Objetivo, type Sugestoes, type UserData } from '../models';
import { Navigate, useLocation } from 'react-router';
import { api } from '../services/api';

export default function Dashboard() {
  const location = useLocation();
  const [feedbacks, setFeedbacks] = useState<Record<number, number>>({});
  const [isSending, setIsSending] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const state = location.state as { perfilUsuario: UserData, sugestoes: Sugestoes[] } | null;

  if (!state) {
    return <Navigate to="/profile-wizard" replace />;
  }

  const handleRate = (id: number, rating: number) => {
    setFeedbacks(prev => ({ ...prev, [id]: rating }));
  };

  const allRated = state.sugestoes.every(r => feedbacks[r.id] !== undefined);

  const handleSubmit = async () => {
    setIsSending(true);

    try {
      const requests = Object.entries(feedbacks).map(async ([sugestaoId, avaliacao]) => {

        const sugestaoOriginal = state.sugestoes.find(s => s.id === Number(sugestaoId));

        if (!sugestaoOriginal) return null;

        const payload = {
          sugestaoId: Number(sugestaoId),
          avaliacao: avaliacao,
        };

        return api.post('/Feedback', payload);
      });

      await Promise.all(requests);

      setIsFinished(true);

    } catch (error) {
      console.error("Erro ao enviar feedbacks:", error);
      alert("Houve um erro ao salvar suas avaliações. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  };

  // Reseta a demo
  const handleReset = () => {
    setFeedbacks({});
    setIsFinished(false);
  }

  // Variantes de Animação
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const OBJETIVO_USUARIO = (Object.keys(Objetivo).find(key => Objetivo[key as keyof typeof Objetivo] === state.perfilUsuario.objetivo))?.toString().replace('_', ' DE ');
  const FOCO_USUARIO = (Object.keys(Foco).find(key => Foco[key as keyof typeof Foco] === state.perfilUsuario.foco))?.toString().replace('_', ' ');

  // Lógica de Cores baseada no objetivo mockado
  const themeColor = OBJETIVO_USUARIO === 'Perda De Peso' ? 'from-orange-600 to-red-900' :
    OBJETIVO_USUARIO === 'Ganho De Massa' ? 'from-blue-600 to-indigo-900' :
      'from-green-600 to-emerald-900';

  const accentColor = OBJETIVO_USUARIO === 'Perda De Peso' ? 'text-orange-400' :
    OBJETIVO_USUARIO === 'Ganho De Massa' ? 'text-blue-400' :
      'text-green-400';

  return (
    <div className="min-h-screen w-full bg-[#1a1a1a] flex items-center justify-center md:p-6 overflow-x-hidden">
      <div className="w-full max-w-md md:max-w-6xl mx-auto flex flex-col md:flex-row gap-6 min-h-screen md:min-h-0 md:h-[80vh] p-4 md:p-0">

        {/* SIDEBAR (Desktop) / HEADER (Mobile) */}
        <aside className="w-full md:w-80 md:shrink-0 flex flex-col gap-4">

          <div className={`relative p-6 md:h-full flex flex-col justify-end md:justify-between rounded-3xl overflow-hidden bg-gradient-to-br ${themeColor} shadow-2xl`}>
            {/* Efeito de fundo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

            <div className="relative z-10 pt-2 md:pt-0">
              <div className="flex justify-between items-start md:block">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] md:text-xs font-bold text-white mb-2 md:mb-4 border border-white/20 uppercase tracking-wider">
                    IA Plan Demo
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">Seu Treino</h1>
                  <p className="text-white/70 text-xs md:text-sm md:mb-6 mt-1">
                    Foco em <strong className="text-white capitalize">{OBJETIVO_USUARIO?.toLowerCase()}</strong>
                  </p>
                </div>

                {/* Mini Status (Mobile) */}
                <div className="md:hidden bg-black/20 rounded-xl p-2 text-center min-w-[70px]">
                  <div className="text-lg font-bold text-white">{Object.keys(feedbacks).length}/{state.sugestoes.length}</div>
                  <div className="text-[10px] text-white/60 uppercase">Avaliados</div>
                </div>
              </div>

              {/* Tags Info */}
              <div className="flex gap-3 mt-6 md:mt-0 overflow-x-auto pb-2 md:pb-0 md:flex-col md:gap-3 no-scrollbar">
                <div className="flex items-center gap-2 bg-black/10 md:bg-black/20 px-3 py-1.5 rounded-lg whitespace-nowrap text-white/80 text-xs md:text-sm">
                  <Clock size={14} /> <span>~45 min</span>
                </div>
                <div className="flex items-center gap-2 bg-black/10 md:bg-black/20 px-3 py-1.5 rounded-lg whitespace-nowrap text-white/80 text-xs md:text-sm">
                  <Zap size={14} /> <span>Intenso</span>
                </div>
                <div className="flex items-center gap-2 bg-black/10 md:bg-black/20 px-3 py-1.5 rounded-lg whitespace-nowrap text-white/80 text-xs md:text-sm">
                  <Target size={14} /> <span className='capitalize'>{FOCO_USUARIO?.toLowerCase()}</span>
                </div>
              </div>
            </div>

            {/* Botão de Ação Desktop */}
            <div className="hidden md:block mt-8">
              <div className="mb-4">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Progresso da Avaliação</span>
                  <span>{Object.keys(feedbacks).length}/{state.sugestoes.length}</span>
                </div>
                <div className="h-1 bg-black/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300 ease-out"
                    style={{ width: `${(Object.keys(feedbacks).length / state.sugestoes.length) * 100}%` }}
                  />
                </div>
              </div>

              {!isFinished ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allRated || isSending}
                  className={`w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg 
                                ${allRated
                      ? 'bg-white text-black hover:bg-zinc-200 cursor-pointer hover:scale-[1.02]'
                      : 'bg-black/20 text-white/40 cursor-not-allowed border border-white/5'}`
                  }
                >
                  {isSending ? "Enviando..." : allRated ? <><Trophy size={18} /> Finalizar Treino</> : "Avalie todos"}
                </button>
              ) : (
                <button onClick={handleReset} className="w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 transition-all">
                  <RefreshCw size={18} /> Recomeçar Demo
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL */}
        <main className={`flex-1 bg-zinc-900 rounded-3xl border border-zinc-800 p-5 md:p-8 shadow-2xl relative z-20 md:overflow-y-auto 
          [&::-webkit-scrollbar]:w-2 
          [&::-webkit-scrollbar-track]:bg-transparent 
          [&::-webkit-scrollbar-thumb]:bg-zinc-700 
          [&::-webkit-scrollbar-thumb]:rounded-full 
          [&::-webkit-scrollbar-thumb]:hover:bg-zinc-600`}>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                Sugestões da IA <span className="text-xs font-normal text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">{state.sugestoes.length} exercícios</span>
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm mt-1">Dê seu feedback para calibrarmos o próximo treino.</p>
            </div>
          </div>

          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 pb-24 md:pb-0">
            {state.sugestoes.map((exercise) => {
              const currentRating = feedbacks[exercise.id];

              return (
                <motion.div key={exercise.id} variants={itemAnim} className="relative p-4 md:p-5 rounded-2xl border border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors flex flex-col justify-between h-full group">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-zinc-900 border border-zinc-700 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 text-xs font-bold shadow-sm group-hover:border-zinc-600 transition-colors">
                        #{exercise.rank}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded bg-zinc-900 border border-zinc-800 ${accentColor} flex items-center gap-1`}>
                        <BarChart size={10} /> Match: {exercise.pontosPerfil}
                      </span>
                    </div>
                    <h3 className="font-bold text-base md:text-lg text-white mb-1 leading-tight">{exercise.nomeExercicio}</h3>
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] md:text-xs uppercase tracking-wider mb-4 font-medium">
                      <Dumbbell size={12} /> {exercise.focoMuscular}
                    </div>
                  </div>

                  {/* BOTÕES DE AÇÃO */}
                  <div className="flex gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleRate(exercise.id, 0)}
                      className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-all active:scale-95 duration-200 cursor-pointer
                                        ${currentRating === 0
                          ? 'bg-red-500/10 text-red-400 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                          : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-700 border border-zinc-800'}`}
                    >
                      <ThumbsDown size={16} className={currentRating === 0 ? 'fill-red-400 scale-110' : ''} />
                    </button>

                    <button
                      onClick={() => handleRate(exercise.id, 1)}
                      className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-all active:scale-95 duration-200 cursor-pointer
                                        ${currentRating === 1
                          ? 'bg-green-500/10 text-green-400 border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                          : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-700 border border-zinc-800'}`}
                    >
                      <ThumbsUp size={16} className={currentRating === 1 ? 'fill-green-400 scale-110' : ''} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </main>

        {/* BARRA FLUTUANTE MOBILE */}
        <div className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-50">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent -top-10 pointer-events-none" />

          <button
            onClick={handleSubmit}
            disabled={!allRated || isSending}
            className={`relative w-full py-4 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-2xl active:scale-95 
                    ${allRated
                ? 'bg-white text-black scale-100 opacity-100'
                : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}
          >
            {isSending ? "Processando..." : allRated ? <><Send size={20} /> Confirmar Treino</> :
              <span className="flex items-center gap-2 text-sm">
                <span className="bg-zinc-700 text-white px-2 py-0.5 rounded text-xs">{Object.keys(feedbacks).length}/{state.sugestoes.length}</span> Avalie todos
              </span>}
          </button>
        </div>
      </div>
    </div>
  );
}