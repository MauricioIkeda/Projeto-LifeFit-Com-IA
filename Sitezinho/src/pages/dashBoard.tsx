import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ThumbsUp, ThumbsDown, Zap, Send, Dumbbell, Target, Trophy, BarChart, RefreshCw } from 'lucide-react';

// --- DEFINIÇÃO DE TIPOS ---
type Recommendation = {
  rank: number;
  exercicio_id: number;
  exercicio_nome: string;
  grupo_muscular: string;
  match_score: string;
};

// --- DADOS MOCKADOS (PLACEHOLDERS) ---
const MOCK_USER = {
  goal: 'ganhar_massa', // Opções: 'ganhar_massa', 'perder_peso', 'resistencia'
  muscleFocus: 'Peitoral & Tríceps'
};

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { rank: 1, exercicio_id: 101, exercicio_nome: "Supino Inclinado com Halteres", grupo_muscular: "Peitoral Superior", match_score: "98%" },
  { rank: 2, exercicio_id: 102, exercicio_nome: "Crucifixo na Polia (Crossover)", grupo_muscular: "Peitoral", match_score: "95%" },
  { rank: 3, exercicio_id: 103, exercicio_nome: "Tríceps Testa (Skullcrushers)", grupo_muscular: "Tríceps", match_score: "92%" },
  { rank: 4, exercicio_id: 104, exercicio_nome: "Flexão Diamante", grupo_muscular: "Tríceps / Peito", match_score: "88%" },
];

export default function Dashboard() {
  // Estado local tipado: Chave (ID) é number, Valor (Rating) é number
  const [feedbacks, setFeedbacks] = useState<Record<number, number>>({});
  const [isSending, setIsSending] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleRate = (id: number, rating: number) => {
    setFeedbacks(prev => ({ ...prev, [id]: rating }));
  };

  const allRated = MOCK_RECOMMENDATIONS.every(r => feedbacks[r.exercicio_id] !== undefined);

  const handleSubmit = () => {
    setIsSending(true);
    // Simula uma requisição de API
    setTimeout(() => {
      setIsSending(false);
      setIsFinished(true);
      alert("Feedback enviado com sucesso! (Simulação)");
    }, 1500);
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

  // Lógica de Cores baseada no objetivo mockado
  const themeColor = MOCK_USER.goal === 'perder_peso' ? 'from-orange-600 to-red-900' :
    MOCK_USER.goal === 'ganhar_massa' ? 'from-blue-600 to-indigo-900' :
      'from-green-600 to-emerald-900';

  const accentColor = MOCK_USER.goal === 'perder_peso' ? 'text-orange-400' :
    MOCK_USER.goal === 'ganhar_massa' ? 'text-blue-400' :
      'text-green-400';

  return (
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
                  Foco em <strong className="text-white capitalize">{MOCK_USER.goal.replace('_', ' ')}</strong>
                </p>
              </div>

              {/* Mini Status (Mobile) */}
              <div className="md:hidden bg-black/20 rounded-xl p-2 text-center min-w-[70px]">
                <div className="text-lg font-bold text-white">{Object.keys(feedbacks).length}/{MOCK_RECOMMENDATIONS.length}</div>
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
                <Target size={14} /> <span>{MOCK_USER.muscleFocus}</span>
              </div>
            </div>
          </div>

          {/* Botão de Ação Desktop */}
          <div className="hidden md:block mt-8">
            <div className="mb-4">
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>Progresso da Avaliação</span>
                <span>{Object.keys(feedbacks).length}/{MOCK_RECOMMENDATIONS.length}</span>
              </div>
              <div className="h-1 bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300 ease-out"
                  style={{ width: `${(Object.keys(feedbacks).length / MOCK_RECOMMENDATIONS.length) * 100}%` }}
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
      <main className="flex-1 bg-zinc-900 rounded-3xl border border-zinc-800 p-5 md:p-8 shadow-2xl relative z-20 md:overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              Sugestões da IA <span className="text-xs font-normal text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">{MOCK_RECOMMENDATIONS.length} exercícios</span>
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm mt-1">Dê seu feedback para calibrarmos o próximo treino.</p>
          </div>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 pb-24 md:pb-0">
          {MOCK_RECOMMENDATIONS.map((exercise) => {
            const currentRating = feedbacks[exercise.exercicio_id];

            return (
              <motion.div key={exercise.rank} variants={itemAnim} className="relative p-4 md:p-5 rounded-2xl border border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors flex flex-col justify-between h-full group">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-zinc-900 border border-zinc-700 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 text-xs font-bold shadow-sm group-hover:border-zinc-600 transition-colors">
                      #{exercise.rank}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded bg-zinc-900 border border-zinc-800 ${accentColor} flex items-center gap-1`}>
                      <BarChart size={10} /> Match: {exercise.match_score}
                    </span>
                  </div>
                  <h3 className="font-bold text-base md:text-lg text-white mb-1 leading-tight">{exercise.exercicio_nome}</h3>
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px] md:text-xs uppercase tracking-wider mb-4 font-medium">
                    <Dumbbell size={12} /> {exercise.grupo_muscular}
                  </div>
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="flex gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleRate(exercise.exercicio_id, 0)}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-all active:scale-95 duration-200
                                        ${currentRating === 0
                        ? 'bg-red-500/10 text-red-400 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-700 border border-zinc-800'}`}
                  >
                    <ThumbsDown size={16} className={currentRating === 0 ? 'fill-red-400 scale-110' : ''} />
                  </button>

                  <button
                    onClick={() => handleRate(exercise.exercicio_id, 1)}
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-all active:scale-95 duration-200
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
              <span className="bg-zinc-700 text-white px-2 py-0.5 rounded text-xs">{Object.keys(feedbacks).length}/{MOCK_RECOMMENDATIONS.length}</span> Avalie todos
            </span>}
        </button>
      </div>
    </div>
  );
}