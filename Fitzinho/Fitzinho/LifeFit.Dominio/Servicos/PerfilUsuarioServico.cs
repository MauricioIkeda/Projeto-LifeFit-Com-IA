using FGB.Dominio.Repositorios.IRepositorios;
using FGB.Dominio.Servicos;
using LifeFit.Dominio.Entidades;

namespace LifeFit.Dominio.Servicos
{
    public class PerfilUsuarioServico : ServicoCrud<PerfilUsuario>
    {
        public PerfilUsuarioServico(IRepositorio repo) : base(repo)
        {
        }
    }
}
