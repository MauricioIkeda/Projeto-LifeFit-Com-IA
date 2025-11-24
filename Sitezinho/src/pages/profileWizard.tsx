import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, ChevronLeft, User, Ruler, Weight, CheckCircle,
    Calendar, Target, Dumbbell, Flame, BicepsFlexed, Activity
} from 'lucide-react';
import type { UserData, FinalProfile } from '../models/index';
import { Sexo, NivelAtividade, Objetivo, Foco } from '../models/index';
import { api } from '../services/api';

const AnimatedInput = (props: React.ComponentProps<'input'>) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const timer = setTimeout(() => { inputRef.current?.focus(); }, 350);
        return () => clearTimeout(timer);
    }, []);
    return <input ref={inputRef} {...props} />;
};

export default function ProfileWizard() {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(0);

    const [formData, setFormData] = useState<Partial<UserData>>({});

    const updateData = (field: keyof UserData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => { setDirection(1); setStep((prev) => prev + 1); };

    const handleGoalSelection = (selectedGoal: number) => {
        updateData('objetivo', selectedGoal);
        setDirection(1);
        if (selectedGoal === Objetivo.GANHO_MASSA) {
            setStep(6);
        } else {
            updateData('foco', Foco.GERAL_CARDIO);
            setStep(7);
        }
    };

    const handleBack = () => {
        setDirection(-1);
        if (step === 7 && formData.objetivo !== Objetivo.GANHO_MASSA) {
            setStep(5);
        } else {
            setStep(prev => prev - 1);
        }
    };

    async function handleFinalSubmit() {
        const profileNumerico: FinalProfile = {
            nome: "Usuário Exemplo",
            sexo: formData.sexo || 0,
            idade: parseInt(formData.idade || '0'),
            altura: parseFloat(formData.altura || '0'),
            peso: parseFloat(formData.peso || '0'),
            nivelAtividadeFisica: formData.nivelAtividadeFisica || 1,
            objetivo: formData.objetivo || 1,
            foco: formData.foco || 1
        };

        const response = await api.post(`/RequisicaoSugestao/GerarSugestoes`, profileNumerico);
        console.log('Sugestões geradas:', response.data);
    };

    const variants = {
        enter: (direction: number) => ({ x: direction > 0 ? 20 : -20, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (direction: number) => ({ x: direction < 0 ? 20 : -20, opacity: 0 }),
    };

    const iconVariants = {
        enter: { opacity: 0, scale: 0.5, position: "absolute" as const },
        center: { opacity: 1, scale: 1, position: "relative" as const },
        exit: { opacity: 0, scale: 0.5, position: "absolute" as const },
    };

    const stepInfo = [
        { title: "Identidade", subtitle: "Seu gênero biológico.", icon: User, color: "text-blue-500", bg: "bg-blue-500" },
        { title: "Idade", subtitle: "Sua idade metabólica.", icon: Calendar, color: "text-purple-500", bg: "bg-purple-500" },
        { title: "Altura", subtitle: "Cálculo de IMC.", icon: Ruler, color: "text-green-500", bg: "bg-green-500" },
        { title: "Peso", subtitle: "Intensidade ideal.", icon: Weight, color: "text-yellow-500", bg: "bg-yellow-500" },
        { title: "Rotina", subtitle: "Gasto calórico diário.", icon: Activity, color: "text-cyan-500", bg: "bg-cyan-500" },
        { title: "Objetivo", subtitle: "Onde quer chegar?", icon: Target, color: "text-red-500", bg: "bg-red-500" },
        { title: "Foco", subtitle: "Prioridade muscular.", icon: Dumbbell, color: "text-blue-400", bg: "bg-blue-400" },
        { title: "Pronto!", subtitle: "Gerando treino...", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500" },
    ];

    const currentInfo = stepInfo[step] || stepInfo[0];
    const isShortPath = formData.objetivo && formData.objetivo !== Objetivo.GANHO_MASSA;
    const currentTotalSteps = isShortPath ? 6 : 7;
    const progressValue = step === 7 ? 100 : ((step + 1) / (currentTotalSteps + 1)) * 100;

    return (
        <div className="min-h-screen w-full bg-[#1a1a1a] flex items-center justify-center md:p-6 overflow-x-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-zinc-800/40 to-black -z-10" />
            <div className="w-full max-w-md md:max-w-5xl mx-auto bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden h-[650px] flex flex-col md:flex-row relative transition-all duration-500">

                {/* PAINEL ESQUERDO */}
                <div className="hidden md:flex md:w-1/2 bg-zinc-800/50 p-12 flex-col justify-between relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-white/5 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-colors duration-500 opacity-20 ${currentInfo.bg}`} />
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="h-1 w-12 bg-zinc-700 rounded-full overflow-hidden"><div className="h-full bg-white transition-all duration-500" style={{ width: `${progressValue}%` }} /></div>
                            <span className="text-xs font-bold text-zinc-500 tracking-widest uppercase">Passo {isShortPath ? step : step + 1} / {currentTotalSteps + 1}</span>
                        </div>
                        <motion.div key={`text-${step}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <h1 className="text-4xl font-bold text-white mb-4">{currentInfo.title}</h1>
                            <p className="text-lg text-zinc-400 leading-relaxed max-w-xs">{currentInfo.subtitle}</p>
                        </motion.div>
                    </div>

                    <div className="w-full flex justify-center items-center h-48">
                        <motion.div
                            key={`icon-${step}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100 }}
                        >
                            <currentInfo.icon size={180} className={`opacity-80 ${currentInfo.color} drop-shadow-2xl`} />
                        </motion.div>
                    </div>
                </div>

                {/* PAINEL DIREITO */}
                <div className="flex-1 flex flex-col relative bg-zinc-900">
                    <div className="md:hidden absolute top-0 left-0 h-1 bg-green-600 transition-all duration-500" style={{ width: `${progressValue}%` }} />

                    {step > 0 && (
                        <button onClick={handleBack} className="absolute top-6 left-6 text-zinc-400 hover:text-white z-20 disabled:opacity-0 bg-zinc-800/50 p-2 rounded-full md:bg-transparent cursor-pointer">
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    <div className="flex-1 flex flex-col justify-start pt-24 md:justify-center md:pt-12 p-6 md:p-12 max-w-md mx-auto w-full transition-all duration-500">

                        {/* HEADER MOBILE */}
                        <div className="md:hidden flex flex-col items-center mb-8 relative h-24 justify-end shrink-0">
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 ${currentInfo.bg} rounded-full blur-[50px] opacity-20 transition-colors duration-500`} />
                            <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                                <AnimatePresence mode="popLayout">
                                    <motion.div key={`mob-icon-${step}`} variants={iconVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className={`p-3 rounded-full bg-zinc-800/50 border border-white/5 ${currentInfo.color}`}>
                                        <currentInfo.icon size={32} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div key={`mob-title-${step}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="text-center">
                                    <h2 className="text-xl font-bold text-white">{currentInfo.title}</h2>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* CONTAINER PRINCIPAL */}
                        <div className="relative w-full h-full">
                            <AnimatePresence mode="wait" custom={direction}>

                                {/* PASSO 0: GÊNERO */}
                                {step === 0 && (
                                    <motion.div key="step0" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col items-center justify-center gap-6 w-full">
                                        <div className="flex gap-4 w-full">
                                            <button onClick={() => { updateData('sexo', Sexo.MASCULINO); nextStep(); }} className="flex-1 p-6 bg-zinc-800/50 rounded-3xl border-2 border-transparent hover:border-blue-500/50 hover:bg-zinc-800 transition-all group flex flex-col items-center justify-center gap-4 relative overflow-hidden cursor-pointer">
                                                <div className="absolute inset-0 bg-linear-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="p-4 rounded-full bg-zinc-900 text-blue-500 group-hover:scale-110 transition-transform relative z-10 shadow-lg shadow-blue-900/20">
                                                    <User size={32} />
                                                </div>
                                                <span className="text-lg font-medium text-zinc-300 group-hover:text-white relative z-10">Masculino</span>
                                            </button>
                                            <button onClick={() => { updateData('sexo', Sexo.FEMININO); nextStep(); }} className="flex-1 p-6 bg-zinc-800/50 rounded-3xl border-2 border-transparent hover:border-pink-500/50 hover:bg-zinc-800 transition-all group flex flex-col items-center justify-center gap-4 relative overflow-hidden cursor-pointer">
                                                <div className="absolute inset-0 bg-linear-to-tr from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="p-4 rounded-full bg-zinc-900 text-pink-500 group-hover:scale-110 transition-transform relative z-10 shadow-lg shadow-pink-900/20">
                                                    <User size={32} />
                                                </div>
                                                <span className="text-lg font-medium text-zinc-300 group-hover:text-white relative z-10">Feminino</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* PASSO 1: Idade */}
                                {step === 1 && (
                                    <motion.div key="step1" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col items-center justify-center gap-6 w-full">
                                        <div className="relative w-full">
                                            <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full opacity-20 pointer-events-none" />
                                            <AnimatedInput type="number" value={formData.idade || ''} onChange={(e) => updateData('idade', e.target.value)} placeholder="25" className="w-full bg-zinc-800/50 text-white text-center text-7xl font-bold py-12 rounded-3xl border-2 border-zinc-800 focus:border-purple-500/50 focus:bg-zinc-800 outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none relative z-10" />
                                            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xl z-20">anos</span>
                                        </div>
                                        <button disabled={!formData.idade} onClick={nextStep} className="mt-auto md:mt-4 w-full bg-purple-600 hover:bg-purple-500 text-white p-5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-purple-900/20 cursor-pointer">Próximo <ChevronRight /></button>
                                    </motion.div>
                                )}

                                {/* PASSO 2: Altura */}
                                {step === 2 && (
                                    <motion.div key="step2" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col items-center justify-center gap-6 w-full">
                                        <div className="relative w-full">
                                            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full opacity-20 pointer-events-none" />
                                            <AnimatedInput type="number" value={formData.altura || ''} onChange={(e) => updateData('altura', e.target.value)} placeholder="175" className="w-full bg-zinc-800/50 text-white text-center text-7xl font-bold py-12 rounded-3xl border-2 border-zinc-800 focus:border-green-500/50 focus:bg-zinc-800 outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none relative z-10" />
                                            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xl z-20">cm</span>
                                        </div>
                                        <button disabled={!formData.altura} onClick={nextStep} className="mt-auto md:mt-4 w-full bg-green-600 hover:bg-green-500 text-white p-5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-green-900/20 cursor-pointer">Próximo <ChevronRight /></button>
                                    </motion.div>
                                )}

                                {/* PASSO 3: Peso */}
                                {step === 3 && (
                                    <motion.div key="step3" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col items-center justify-center gap-6 w-full">
                                        <div className="relative w-full">
                                            <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full opacity-20 pointer-events-none" />
                                            <AnimatedInput type="number" value={formData.peso || ''} onChange={(e) => updateData('peso', e.target.value)} placeholder="70" className="w-full bg-zinc-800/50 text-white text-center text-7xl font-bold py-12 rounded-3xl border-2 border-zinc-800 focus:border-yellow-500/50 focus:bg-zinc-800 outline-none transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none relative z-10" />
                                            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xl z-20">kg</span>
                                        </div>
                                        <button disabled={!formData.peso} onClick={nextStep} className="mt-auto md:mt-4 w-full bg-yellow-600 hover:bg-yellow-500 text-white p-5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-yellow-900/20 cursor-pointer">Próximo <ChevronRight /></button>
                                    </motion.div>
                                )}

                                {/* PASSO 4: ATIVIDADE */}
                                {step === 4 && (
                                    <motion.div key="step4" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col items-center justify-center gap-4 w-full">
                                        <div className="flex flex-col gap-3 w-full">
                                            {[
                                                { val: NivelAtividade.SEDENTARIO, label: 'Sedentário', desc: 'Pouco ou nenhum' },
                                                { val: NivelAtividade.LEVE, label: 'Leve', desc: '1-3 dias/semana' },
                                                { val: NivelAtividade.MODERADO, label: 'Moderado', desc: '3-5 dias/semana' },
                                                { val: NivelAtividade.ALTO, label: 'Alto', desc: '6-7 dias/semana' }
                                            ].map((opt) => (
                                                <button key={opt.val} onClick={() => { updateData('nivelAtividadeFisica', opt.val); nextStep(); }} className="w-full p-4 bg-zinc-800 rounded-2xl text-left text-white font-medium hover:bg-cyan-900/30 hover:border-cyan-500 border-2 border-transparent transition-all group shrink-0 cursor-pointer">
                                                    <div className="flex justify-between items-center">
                                                        <div><span className="block text-lg group-hover:text-cyan-400 transition-colors">{opt.label}</span><span className="text-sm text-zinc-500">{opt.desc}</span></div>
                                                        <ChevronRight className="text-zinc-600 group-hover:text-cyan-500" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* PASSO 5: OBJETIVO */}
                                {step === 5 && (
                                    <motion.div key="step5" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col items-center justify-center gap-4 w-full">
                                        <div className="flex flex-col gap-3 w-full">
                                            {[
                                                { val: Objetivo.PERDA_PESO, label: 'Perder Peso', icon: Flame, color: 'text-orange-500', border: 'group-hover:border-orange-500' },
                                                { val: Objetivo.GANHO_MASSA, label: 'Ganhar Massa', icon: BicepsFlexed, color: 'text-blue-500', border: 'group-hover:border-blue-500' },
                                                { val: Objetivo.SAUDE, label: 'Saúde e Bem-estar', icon: CheckCircle, color: 'text-green-500', border: 'group-hover:border-green-500' }
                                            ].map((opt) => (
                                                <button key={opt.val} onClick={() => handleGoalSelection(opt.val)} className={`flex items-center p-4 bg-zinc-800 rounded-2xl hover:bg-zinc-800/80 border-2 border-transparent ${opt.border} transition-all group shrink-0 cursor-pointer`}>
                                                    <div className={`p-3 rounded-full bg-zinc-900 ${opt.color} group-hover:scale-110 transition-transform`}><opt.icon size={24} /></div>
                                                    <span className="ml-4 text-lg font-medium text-white">{opt.label}</span>
                                                    <ChevronRight className="ml-auto text-zinc-500 group-hover:text-white" />
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* PASSO 6: FOCO */}
                                {step === 6 && (
                                    <motion.div key="step6" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col items-center justify-center gap-6 w-full">
                                        <div className="grid grid-cols-2 gap-3 w-full content-start">
                                            {[
                                                { val: Foco.PEITO, label: 'Peito' },
                                                { val: Foco.COSTAS, label: 'Costas' },
                                                { val: Foco.PERNAS, label: 'Pernas' },
                                                { val: Foco.OMBROS, label: 'Ombros' },
                                                { val: Foco.BICEPS, label: 'Bíceps' },
                                                { val: Foco.TRICEPS, label: 'Tríceps' },
                                                { val: Foco.FULL_BODY, label: 'Corpo Todo', fullWidth: true }
                                            ].map((opt) => (
                                                <button key={opt.val} onClick={() => { updateData('foco', opt.val); setStep(7); setDirection(1); }} className={`p-4 rounded-2xl font-medium transition-all border-2 border-zinc-800 hover:border-blue-500 hover:bg-blue-900/20 text-zinc-300 hover:text-white ${opt.fullWidth ? 'col-span-2 bg-zinc-800' : 'bg-zinc-800'} cursor-pointer`}>
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* PASSO 7: RESUMO */}
                                {step === 7 && (
                                    <motion.div key="step7" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center text-center gap-6 w-full">
                                        <div className="bg-zinc-800 w-full p-6 rounded-3xl text-left space-y-3 border border-zinc-700 text-sm shadow-xl">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><span className="text-zinc-500 block mb-1">Gênero</span><span className="text-white font-medium capitalize">{formData.sexo === Sexo.MASCULINO ? 'Masculino' : 'Feminino'}</span></div>
                                                <div><span className="text-zinc-500 block mb-1">Idade</span><span className="text-white font-medium">{formData.idade} anos</span></div>
                                                <div><span className="text-zinc-500 block mb-1">Altura</span><span className="text-white font-medium">{formData.altura} cm</span></div>
                                                <div><span className="text-zinc-500 block mb-1">Peso</span><span className="text-white font-medium">{formData.peso} kg</span></div>
                                                <div className="col-span-2"><span className="text-zinc-500 block mb-1">Atividade</span><span className="text-white font-medium">{Object.keys(NivelAtividade).find(key => NivelAtividade[key as keyof typeof NivelAtividade] === formData.nivelAtividadeFisica)}</span></div>
                                            </div>
                                            <div className="border-t border-zinc-700 pt-3 mt-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-zinc-500">Objetivo</span>
                                                    <span className="text-green-400 bg-green-400/10 px-3 py-1 rounded-full font-bold uppercase text-xs">
                                                        {(Object.keys(Objetivo).find(key => Objetivo[key as keyof typeof Objetivo] === formData.objetivo))?.toString().replace('_', ' DE ')}
                                                    </span>
                                                </div>
                                                {formData.objetivo === Objetivo.GANHO_MASSA && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-zinc-500">Foco</span>
                                                        <span className="text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full font-bold uppercase text-xs">
                                                            {Object.keys(Foco).find(key => Foco[key as keyof typeof Foco] === formData.foco)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button onClick={handleFinalSubmit} className="w-full mt-2 bg-white text-black font-bold p-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-3 shadow-xl cursor-pointer">
                                            {"Gerar Treino com IA 🧠"}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};