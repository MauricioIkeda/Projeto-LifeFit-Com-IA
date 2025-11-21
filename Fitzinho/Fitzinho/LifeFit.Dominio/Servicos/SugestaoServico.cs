using FGB.Dominio.Repositorios.IRepositorios;
using FGB.Dominio.Servicos;
using LifeFit.Dominio.Entidades;

namespace LifeFit.Dominio.Servicos
{
    public class SugestaoServico : ServicoCrud<Sugestao>
    {
        string apiIaUrl = "Localhost:8000/api/v1/recommend";
        public SugestaoServico(IRepositorio repo) : base(repo)
        {
        }
    }
}
