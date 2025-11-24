import bannerImg from '../assets/background.png';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router';

export default function Inicio() {
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Adicionei drop-shadow também no logo para ele "descolar" do fundo */}
            <img src={logo} alt="Logo" className="absolute left-1/2 transform -translate-x-1/2 w-auto h-50 z-30 drop-shadow-lg" />

            <img
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={bannerImg}
            />

            <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>

            <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
                <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-wider mb-4 [text-shadow:0_4px_10px_rgb(0_0_0/90%)]">
                    Supere seus Limites
                </h1>
                
                <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl [text-shadow:0_4px_10px_rgb(0_0_0/90%)]">
                    Treine com nossa IA e alcance a sua melhor versão o quanto antes.
                </p>
                
                <button onClick={() => navigate('/profile-wizard')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 text-lg cursor-pointer shadow-lg hover:shadow-xl">
                    Começar Agora
                </button>
            </div>
        </div>
    );
};