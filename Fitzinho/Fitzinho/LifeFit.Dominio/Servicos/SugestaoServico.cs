using FGB.Dominio.Repositorios.IRepositorios;
using FGB.Dominio.Servicos;
using LifeFit.Dominio.Entidades;

namespace LifeFit.Dominio.Servicos
{
    public class SugestaoServico : ServicoConsulta<Sugestao>
    {
        public SugestaoServico(IRepositorio repo) : base(repo)
        {
        }
    }
}
