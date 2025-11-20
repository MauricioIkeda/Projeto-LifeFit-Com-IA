import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronLeft, User, Ruler, Weight, CheckCircle, 
  Calendar, Target, Dumbbell, Flame, BicepsFlexed 
} from 'lucide-react';

// ============================================================================
// TIPOS
// ============================================================================
type UserData = {
  gender: 'male' | 'female' | '';
  age: string;
  height: string;
  weight: string;
  goal: string;
  muscleFocus: string;
};

// ============================================================================
// INPUT AUXILIAR
// ============================================================================
const AnimatedInput = (props: React.ComponentProps<'input'>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 350); 
    return () => clearTimeout(timer);
  }, []);
  return <input ref={inputRef} {...props} />;
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export const ProfileWizard = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const [formData, setFormData] = useState<UserData>({
    gender: '',
    age: '',
    height: '',
    weight: '',
    goal: '',
    muscleFocus: '' // Será preenchido automaticamente se pularmos a etapa
  });

  // Atualiza dados
  const updateData = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- LÓGICA INTELIGENTE DE NAVEGAÇÃO ---

  // Função especial para quando selecionamos o OBJETIVO (Passo 4)
  const handleGoalSelection = (selectedGoal: string) => {
    updateData('goal', selectedGoal);
    setDirection(1);

    if (selectedGoal === 'ganhar_massa') {
      // Se for ganhar massa, vai para o passo 5 (Foco Muscular)
      setStep(5);
    } else {
      // Se for perder peso/saúde, define foco como "Geral" e PULA para o final (6)
      updateData('muscleFocus', 'geral_cardio'); 
      setStep(6);
    }
  };

  // Função especial para o botão VOLTAR
  const handleBack = () => {
    setDirection(-1);

    // Se estamos no final (6) e o objetivo NÃO ERA ganhar massa, 
    // temos que voltar direto para o passo 4 (Objetivo), ignorando o 5.
    if (step === 6 && formData.goal !== 'ganhar_massa') {
      setStep(4);
    } else {
      setStep(prev => prev - 1);
    }
  };

  // Função padrão de avançar (para os outros passos)
  const nextStep = () => {
    setDirection(1);
    setStep(prev => prev + 1);
  };

  // Animações
  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0 }),
  };

  // Cálculo da barra de progresso
  // Se o objetivo não for musculo, o total de passos "visuais" é menor
  const isShortPath = formData.goal && formData.goal !== 'gain_muscle';
  const currentTotalSteps = isShortPath ? 5 : 6;
  // Ajuste matemático para a barra ficar cheia corretamente
  const progressValue = step === 6 ? 100 : ((step + 1) / (currentTotalSteps + 1)) * 100;

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900 p-6 rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden min-h-[550px] flex flex-col relative">
      
      {/* BARRA DE PROGRESSO INTELIGENTE */}
      <div className="absolute top-0 left-0 h-1 bg-green-600 transition-all duration-500"
           style={{ width: `${progressValue}%` }} />

      {/* Botão Voltar Customizado */}
      {step > 0 && step < 6 && (
        <button onClick={handleBack} className="absolute top-4 left-4 text-zinc-400 hover:text-white z-10">
          <ChevronLeft size={24} />
        </button>
      )}
      
      {/* Botão voltar especial para a tela de resumo */}
      {step === 6 && (
        <button onClick={handleBack} className="absolute top-4 left-4 text-zinc-400 hover:text-white z-10">
          <ChevronLeft size={24} />
        </button>
      )}

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          
          {/* PASSO 0: GÊNERO */}
          {step === 0 && (
            <motion.div key="step0" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col items-center gap-6 w-full">
              <h2 className="text-2xl font-bold text-white">Seu Gênero</h2>
              <div className="flex gap-4 w-full">
                <button onClick={() => { updateData('gender', 'male'); nextStep(); }} className="flex-1 p-6 bg-zinc-800 rounded-2xl hover:bg-blue-900/30 hover:border-blue-500 border-2 border-transparent transition-all group">
                  <User className="w-12 h-12 mx-auto text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="block mt-2 text-zinc-300 font-medium">Masculino</span>
                </button>
                <button onClick={() => { updateData('gender', 'female'); nextStep(); }} className="flex-1 p-6 bg-zinc-800 rounded-2xl hover:bg-pink-900/30 hover:border-pink-500 border-2 border-transparent transition-all group">
                  <User className="w-12 h-12 mx-auto text-pink-500 group-hover:scale-110 transition-transform" />
                  <span className="block mt-2 text-zinc-300 font-medium">Feminino</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* PASSO 1: IDADE */}
          {step === 1 && (
            <motion.div key="step1" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col items-center gap-6 w-full">
              <h2 className="text-2xl font-bold text-white">Sua Idade</h2>
              <Calendar className="w-16 h-16 text-purple-500" />
              <div className="relative w-full">
                <AnimatedInput
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateData('age', e.target.value)}
                  placeholder="25"
                  className="w-full bg-zinc-800 text-white text-center text-4xl p-4 rounded-xl border-2 border-zinc-700 focus:border-purple-500 outline-none transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">anos</span>
              </div>
              <button disabled={!formData.age} onClick={nextStep} className="mt-4 w-full bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                Próximo <ChevronRight />
              </button>
            </motion.div>
          )}

          {/* PASSO 2: ALTURA */}
          {step === 2 && (
            <motion.div key="step2" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col items-center gap-6 w-full">
              <h2 className="text-2xl font-bold text-white">Sua Altura</h2>
              <Ruler className="w-16 h-16 text-green-500" />
              <div className="relative w-full">
                <AnimatedInput
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateData('height', e.target.value)}
                  placeholder="175"
                  className="w-full bg-zinc-800 text-white text-center text-4xl p-4 rounded-xl border-2 border-zinc-700 focus:border-green-500 outline-none transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">cm</span>
              </div>
              <button disabled={!formData.height} onClick={nextStep} className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                Próximo <ChevronRight />
              </button>
            </motion.div>
          )}

          {/* PASSO 3: PESO */}
          {step === 3 && (
            <motion.div key="step3" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col items-center gap-6 w-full">
              <h2 className="text-2xl font-bold text-white">Seu Peso</h2>
              <Weight className="w-16 h-16 text-yellow-500" />
              <div className="relative w-full">
                <AnimatedInput
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateData('weight', e.target.value)}
                  placeholder="70"
                  className="w-full bg-zinc-800 text-white text-center text-4xl p-4 rounded-xl border-2 border-zinc-700 focus:border-yellow-500 outline-none transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">kg</span>
              </div>
              <button disabled={!formData.weight} onClick={nextStep} className="mt-4 w-full bg-yellow-600 hover:bg-yellow-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                Próximo <ChevronRight />
              </button>
            </motion.div>
          )}

          {/* PASSO 4: OBJETIVO (AQUI ESTÁ A MÁGICA) */}
          {step === 4 && (
            <motion.div key="step4" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col items-center gap-6 w-full">
              <h2 className="text-2xl font-bold text-white">Qual seu Objetivo?</h2>
              <Target className="w-16 h-16 text-red-500" />
              
              <div className="flex flex-col gap-3 w-full">
                {[
                  { id: 'perder_peso', label: 'Perder Peso', icon: Flame, color: 'text-orange-500' },
                  { id: 'ganhar_massa', label: 'Ganhar Massa', icon: BicepsFlexed, color: 'text-blue-500' },
                  { id: 'saude_bem_estar', label: 'Saúde e Bem-estar', icon: CheckCircle, color: 'text-green-500' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    // USAMOS A NOVA FUNÇÃO handleGoalSelection AQUI
                    onClick={() => handleGoalSelection(opt.id)}
                    className="flex items-center p-4 bg-zinc-800 rounded-xl hover:bg-zinc-700 border-2 border-transparent hover:border-zinc-500 transition-all"
                  >
                    <div className={`p-2 rounded-full bg-zinc-900 ${opt.color}`}>
                      <opt.icon size={24} />
                    </div>
                    <span className="ml-4 text-lg font-medium text-white">{opt.label}</span>
                    <ChevronRight className="ml-auto text-zinc-500" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PASSO 5: FOCO MUSCULAR (SÓ APARECE SE FOR GANHAR MASSA) */}
          {step === 5 && (
            <motion.div key="step5" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="flex flex-col items-center gap-6 w-full">
              <h2 className="text-2xl font-bold text-white">Foco Muscular</h2>
              <Dumbbell className="w-16 h-16 text-blue-400" />
              
              <div className="grid grid-cols-2 gap-3 w-full">
                {[
                  { id: 'peito', label: 'Peito' },
                  { id: 'costas', label: 'Costas' },
                  { id: 'pernas', label: 'Pernas' },
                  { id: 'ombros', label: 'Ombros' },
                  { id: 'biceps', label: 'Bíceps' },
                  { id: 'triceps', label: 'Tríceps' },
                  { id: 'full_body', label: 'Corpo Todo', fullWidth: true }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { updateData('muscleFocus', opt.id); setStep(6); setDirection(1); }}
                    className={`
                      p-4 rounded-xl font-medium transition-all border-2 border-zinc-800
                      hover:border-blue-500 hover:bg-blue-900/20 text-zinc-300 hover:text-white
                      ${opt.fullWidth ? 'col-span-2 bg-zinc-800' : 'bg-zinc-800'} 
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* PASSO 6: RESUMO FINAL */}
          {step === 6 && (
            <motion.div key="step6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center gap-4 w-full">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-white">Perfil Completo!</h2>
              
              <div className="bg-zinc-800 w-full p-4 rounded-xl text-left space-y-2 border border-zinc-700 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-zinc-400">Gênero: <span className="text-white capitalize block">{formData.gender}</span></p>
                  <p className="text-zinc-400">Idade: <span className="text-white block">{formData.age} anos</span></p>
                  <p className="text-zinc-400">Altura: <span className="text-white block">{formData.height} cm</span></p>
                  <p className="text-zinc-400">Peso: <span className="text-white block">{formData.weight} kg</span></p>
                </div>
                <div className="border-t border-zinc-700 grid grid-cols-2 gap-2 pt-2 mt-2">
                  <p className="text-zinc-400">Objetivo: <span className="text-green-400 block uppercase font-bold">{formData.goal.replace('_', ' ')}</span></p>
                  {/* Só mostra o foco se ele foi selecionado (ou seja, se for Ganhar Massa) */}
                  {formData.goal === 'ganhar_massa' && (
                    <p className="text-zinc-400">Foco: <span className="text-blue-400 block uppercase font-bold">{formData.muscleFocus}</span></p>
                  )}
                </div>
              </div>

              <button onClick={() => alert(JSON.stringify(formData, null, 2))} className="w-full mt-4 bg-white text-black font-bold p-4 rounded-xl hover:bg-gray-200 transition-colors">
                Gerar Treino Agora 🚀
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};