import { useState } from 'react';
import { ProfileWizard } from "./components/ProfileWizard";
import { WorkoutDashboard } from "./components/WorkoutDashboard";

// Tipos
type Recommendation = {
  rank: number;
  exercicio_nome: string;
  exercicio_id: number;
  grupo_muscular: string;
  match_score: string;
};

export default function App() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [apiData, setApiData] = useState<any>(null);
  const [apiRecommendations, setApiRecommendations] = useState<Recommendation[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [finished, setFinished] = useState(false);

  // --- FUNÇÃO DE TRADUÇÃO (FRONTEND -> BACKEND) ---
  const mapDataToApi = (data: any) => {
    const genero = data.gender === 'male' ? 'Masculino' : 'Feminino';
    let objetivo = 'Manutenção';
    if (data.goal === 'perder_peso') objetivo = 'Perda de Peso';
    if (data.goal === 'ganhar_massa') objetivo = 'Hipertrofia';

    const focoMap: Record<string, string> = {
      'peito': 'Peito', 'costas': 'Costas', 'pernas': 'Pernas',
      'ombros': 'Ombros', 'biceps': 'Biceps', 'triceps': 'Triceps',
      'full_body': 'Cardio/Geral', 'geral_cardio': 'Cardio/Geral'
    };
    
    return {
      idade: parseInt(data.age),
      peso: parseFloat(data.weight),
      altura: parseFloat(data.height),
      genero: genero,
      atividade: data.activity,
      objetivo: objetivo,
      foco_muscular: focoMap[data.muscleFocus] || 'Cardio/Geral'
    };
  };

  // BUSCAR RECOMENDAÇÃO
  const handleProfileFinish = async (data: any) => {
    setLoading(true);
    try {
      const payload = mapDataToApi(data);
      setApiData(payload);

      const response = await fetch('http://localhost:8000/api/v1/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(await response.text());

      const result: Recommendation[] = await response.json();
      setApiRecommendations(result);
      setUserProfile(data);

    } catch (error) {
      alert("Erro na API. Verifique o console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ENVIAR FEEDBACK
  const handleSendFeedback = async (feedbacks: { exercicio_id: number; avaliacao: number }[]) => {
    setSendingFeedback(true);
    try {
      const feedbackPayload = {
        perfil: apiData,
        feedbacks: feedbacks
      };

      const response = await fetch('http://localhost:8000/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackPayload),
      });

      if (!response.ok) throw new Error("Erro ao enviar feedback");

      setFinished(true);

    } catch (error) {
      alert("Erro ao salvar feedback.");
    } finally {
      setSendingFeedback(false);
    }
  };

  // TELA DE OBRIGADO
  if (finished) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl mb-4">🧠✨</h1>
          <h2 className="text-2xl font-bold text-white mb-2">Feedback Recebido!</h2>
          <p className="text-zinc-400 mb-8">
            A Inteligência Artificial está aprendendo com suas preferências. 
            Da próxima vez, o treino será ainda mais preciso.
          </p>
          <button 
            onClick={() => { setFinished(false); setUserProfile(null); setApiRecommendations([]); }}
            className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
          >
            Reiniciar Teste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center md:p-6 overflow-x-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/40 to-black -z-10" />
      
      <div className="w-full px-4 transition-all duration-500 flex justify-center">
          {!userProfile ? (
             <ProfileWizard onFinish={handleProfileFinish} isLoading={loading} /> 
          ) : (
            <WorkoutDashboard 
              userData={userProfile} 
              recommendations={apiRecommendations} 
              onSendFeedback={handleSendFeedback}
              isSending={sendingFeedback}
            />
          )}
      </div>
    </div>
  )
}