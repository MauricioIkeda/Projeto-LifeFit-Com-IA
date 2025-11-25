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

        public override bool Valida(PerfilUsuario entidade)
        {
            if (entidade.Idade <= 10 || entidade.Idade > 120)
            {
                Mensagens.Add("Idade inválida.", true);
            }
            if (entidade.Peso <= 30 || entidade.Peso > 500)
            {
                Mensagens.Add("Peso inválido.", true);
            }
            if (entidade.Altura <= 100 || entidade.Altura > 300)
            {
                Mensagens.Add("Altura inválida.", true);
            }
            return !Mensagens.HasErro();
        }
    }
}
