import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ThumbsUp, ThumbsDown, Zap, Send, Dumbbell, Target, Trophy, BarChart } from 'lucide-react';

type Recommendation = {
  rank: number;
  exercicio_nome: string;
  exercicio_id: number;
  grupo_muscular: string;
  match_score: string;
};

type DashboardProps = {
  userData: {
    goal: string;
    muscleFocus: string;
  };
  recommendations: Recommendation[];
  onSendFeedback: (feedbacks: { exercicio_id: number; avaliacao: number }[]) => void;
  isSending: boolean;
};

export const WorkoutDashboard = ({ userData, recommendations, onSendFeedback, isSending }: DashboardProps) => {
  const [feedbacks, setFeedbacks] = useState<Record<number, number>>({});

  const handleRate = (id: number, rating: number) => {
    setFeedbacks(prev => ({ ...prev, [id]: rating }));
  };

  const allRated = recommendations.every(r => feedbacks[r.exercicio_id] !== undefined);

  const handleSubmit = () => {
    const feedbackList = Object.entries(feedbacks).map(([id, rating]) => ({
      exercicio_id: parseInt(id),
      avaliacao: rating
    }));
    onSendFeedback(feedbackList);
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemAnim = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const themeColor = userData.goal === 'perder_peso' ? 'from-orange-600 to-red-900' : 
                     userData.goal === 'ganhar_massa' ? 'from-blue-600 to-indigo-900' : 
                     'from-green-600 to-emerald-900';
  
  const accentColor = userData.goal === 'perder_peso' ? 'text-orange-400' : 
                      userData.goal === 'ganhar_massa' ? 'text-blue-400' : 
                      'text-green-400';

  return (
    <div className="w-full max-w-md md:max-w-6xl mx-auto flex flex-col md:flex-row gap-6 min-h-screen md:min-h-0 md:h-[80vh]">
      
      {/* SIDEBAR (Desktop) / HEADER (Mobile) */}
      <aside className="w-full md:w-80 md:shrink-0 flex flex-col gap-4">
        
        <div className={`relative p-6 md:h-full flex flex-col justify-end md:justify-between rounded-b-3xl md:rounded-3xl overflow-hidden bg-gradient-to-br ${themeColor} shadow-2xl`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="relative z-10 pt-8 md:pt-0">
            <div className="flex justify-between items-start md:block">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] md:text-xs font-bold text-white mb-2 md:mb-4 border border-white/20 uppercase tracking-wider">
                  IA Plan
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">Seu Treino</h1>
                <p className="text-white/70 text-xs md:text-sm md:mb-6">Foco em <strong className="text-white">{userData.goal.replace('_', ' ')}</strong></p>
              </div>
              
              {/* Mini Status só no Mobile */}
              <div className="md:hidden bg-black/20 rounded-xl p-2 text-center min-w-[70px]">
                <div className="text-lg font-bold text-white">{Object.keys(feedbacks).length}/{recommendations.length}</div>
                <div className="text-[10px] text-white/60 uppercase">Avaliados</div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-4 md:mt-0 overflow-x-auto pb-2 md:pb-0 md:flex-col md:gap-3 no-scrollbar">
               <div className="flex items-center gap-2 bg-black/10 md:bg-black/20 px-3 py-1.5 rounded-lg whitespace-nowrap text-white/80 text-xs md:text-sm">
                  <Clock size={14} /> <span>~45 min</span>
               </div>
               <div className="flex items-center gap-2 bg-black/10 md:bg-black/20 px-3 py-1.5 rounded-lg whitespace-nowrap text-white/80 text-xs md:text-sm">
                  <Zap size={14} /> <span>Intenso</span>
               </div>
               {userData.goal === 'ganhar_massa' && (
                 <div className="flex items-center gap-2 bg-black/10 md:bg-black/20 px-3 py-1.5 rounded-lg whitespace-nowrap text-white/80 text-xs md:text-sm">
                    <Target size={14} /> <span>{userData.muscleFocus}</span>
                 </div>
               )}
            </div>
          </div>

          {/* STATUS DESKTOP (Escondido no Mobile) */}
          <div className="hidden md:block mt-8">
             <div className="mb-4">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                   <span>Avaliação</span>
                   <span>{Object.keys(feedbacks).length}/{recommendations.length}</span>
                </div>
                <div className="h-1 bg-black/20 rounded-full overflow-hidden">
                   <div className="h-full bg-white transition-all duration-300" style={{ width: `${(Object.keys(feedbacks).length / recommendations.length) * 100}%` }} />
                </div>
             </div>
             <button onClick={handleSubmit} disabled={!allRated || isSending} className={`w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${allRated ? 'bg-white text-black hover:bg-zinc-200 cursor-pointer' : 'bg-black/20 text-white/40 cursor-not-allowed border border-white/5'}`}>
               {isSending ? "Enviando..." : allRated ? <><Trophy size={18} /> Finalizar</> : "Avalie todos"}
             </button>
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 bg-zinc-900 rounded-t-3xl md:rounded-3xl border-t md:border border-zinc-800 p-5 md:p-8 shadow-2xl md:overflow-y-auto custom-scrollbar -mt-6 md:mt-0 relative z-20 pb-32 md:pb-0">
         <div className="flex justify-between items-end mb-6 md:mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                 Exercícios <span className="md:hidden text-xs font-normal text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">{recommendations.length} total</span>
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm mt-1">Avalie as sugestões da IA.</p>
            </div>
         </div>

         <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {recommendations.map((exercise) => {
              const currentRating = feedbacks[exercise.exercicio_id]; 

              return (
                <motion.div key={exercise.rank} variants={itemAnim} className="relative p-4 md:p-5 rounded-2xl border border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                       <div className="bg-zinc-900 border border-zinc-700 w-7 h-7 flex items-center justify-center rounded-full text-zinc-400 text-xs font-bold shadow-sm">#{exercise.rank}</div>
                       <span className={`text-[10px] font-bold px-2 py-1 rounded bg-zinc-900 border border-zinc-800 ${accentColor} flex items-center gap-1`}>
                          <BarChart size={10} /> {exercise.match_score}
                       </span>
                    </div>
                    <h3 className="font-bold text-base md:text-lg text-white mb-1 leading-tight">{exercise.exercicio_nome}</h3>
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] md:text-xs uppercase tracking-wider mb-4"><Dumbbell size={12} /> {exercise.grupo_muscular}</div>
                  </div>

                  {/* BOTÕES DE AÇÃO */}
                  <div className="flex gap-2 pt-3 border-t border-white/5">
                    <button onClick={() => handleRate(exercise.exercicio_id, 0)} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-all active:scale-95 ${currentRating === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-700 border border-zinc-800'}`}>
                      <ThumbsDown size={16} className={currentRating === 0 ? 'fill-red-400' : ''} /> Não gostei
                    </button>
                    <button onClick={() => handleRate(exercise.exercicio_id, 1)} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-all active:scale-95 ${currentRating === 1 ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-700 border border-zinc-800'}`}>
                      <ThumbsUp size={16} className={currentRating === 1 ? 'fill-green-400' : ''} /> Gostei
                    </button>
                  </div>
                </motion.div>
              );
            })}
         </motion.div>
      </main>

      {/* BARRA FLUTUANTE MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-50">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent -top-10 pointer-events-none" />
        
        <button onClick={handleSubmit} disabled={!allRated || isSending} className={`relative w-full py-4 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-2xl active:scale-95 ${allRated ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
          {isSending ? "Enviando..." : allRated ? <><Send size={20} /> Confirmar Treino</> : 
          <span className="flex items-center gap-2 text-sm">
            <span className="bg-zinc-700 text-white px-2 py-0.5 rounded text-xs">{Object.keys(feedbacks).length}/{recommendations.length}</span> Avalie todos para finalizar
          </span>}
        </button>
      </div>
    </div>
  );
};