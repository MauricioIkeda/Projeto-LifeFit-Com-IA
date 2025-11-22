using FGB.Dominio.Repositorios.IRepositorios;
using FGB.Dominio.Servicos;
using LifeFit.Dominio.Entidades;

namespace LifeFit.Dominio.Servicos
{
    public class FeedbackServico : ServicoCrud<Feedback>
    {
        public FeedbackServico(IRepositorio repo) : base(repo)
        {
        }

    }
}
