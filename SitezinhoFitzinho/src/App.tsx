import { ProfileWizard } from "./components/ProfileWizard";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      {/* Fundo com um gradiente sutil pra ficar bonito */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/50 to-black -z-10" />
      
      <div className="w-full max-w-md">
        <h1 className="text-center text-zinc-500 font-medium mb-8 tracking-widest text-sm uppercase">
          Configuração Inicial
        </h1>
        
        <ProfileWizard />
        
      </div>
    </div>
  )
}