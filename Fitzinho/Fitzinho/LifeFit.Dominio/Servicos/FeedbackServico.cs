using FGB.Dominio.Repositorios.IRepositorios;
using FGB.Dominio.Servicos;
using LifeFit.Dominio.Entidades;
using System.Linq;

namespace LifeFit.Dominio.Servicos
{
    public class FeedbackServico : ServicoCrud<Feedback>
    {
        public FeedbackServico(IRepositorio repo) : base(repo)
        {
        }

        public override bool Inclui(Feedback[] entidades)
        {
            try
            {
                if (entidades.Length == 0)
                    return true;

                if (!entidades.All(Validacoes))
                    return false;

                foreach (var entidade in entidades)
                {
                    var AvaliacaoSugestao = _repo.Consulta<Feedback>().FirstOrDefault(f => f.sugestaoId == entidade.sugestaoId);
                    if (AvaliacaoSugestao != null)
                    {
                        Mensagens.Add("Já existe uma avaliação para esta sugestão.");
                        return false;
                    }

                    entidade.CriadoEm = DateTime.UtcNow;
                    entidade.UltimaAlteracao = DateTime.UtcNow;
                    _repo.Inclui(entidade);
                }
                return true;
            }
            catch (Exception ex)
            {
                Mensagens.Add("Erro ao incluir entidade: " + ex.Message);
                return false;
            }
        }
    }
}
