using FGB.Dominio.Eventos;
using FGB.Dominio.Entidades;
using FGB.Dominio.Repositorios.IRepositorios;
using System.Diagnostics;
using System.Threading.Tasks;

namespace FGB.Dominio.Servicos
{
    public class ServicoCrud<T> : ServicoConsulta<T>  where T : EntidadeBase
    {
        public event MergeHandler<T> PosMerge;
        public event MergeHandler<T> PreMerge;
        public event DeleteHandler<T> PosDelete;
        public event DeleteHandler<T> PreDelete;
        public event IncluiHandler<T> PosInclui;
        public event IncluiHandler<T> PreInclui;

        public ServicoCrud(IRepositorio repo) : base(repo)
        {
        }

        public virtual bool Valida(T entidade)
        {
            return !Mensagens.HasErro();
        }
        public virtual bool Validacoes(T entidade)
        {
            if (entidade == null)
            {
                Mensagens.Add("Entidade vazia na requisição.");
                return false;
            }
            return Valida(entidade);
        }

        public virtual bool Inclui(T[] entidades, Func<bool> processo)
        {
            if (entidades.Length == 0)
                return true;

            if(!entidades.All(Validacoes))
                return false;
            foreach (var entidade in entidades)
            {
                entidade.CriadoEm = DateTime.UtcNow;
                entidade.UltimaAlteracao = DateTime.UtcNow;
            }
            var sucesso = processo();

            return sucesso;
        }

        public virtual async Task<bool> IncluiAsync(T[] entidades, Func<Task<bool>> processo)
        {
            if (entidades.Length == 0)
                return true;
            if (!entidades.All(Validacoes))
                return false;

            foreach (var entidade in entidades)
            {
                entidade.CriadoEm = DateTime.UtcNow;
                entidade.UltimaAlteracao = DateTime.UtcNow;
            }

            var sucesso = await processo();
            return sucesso;
        }

        public virtual T Merge(T entidade)
        {
            if (!Validacoes(entidade))
                return entidade;

            entidade.UltimaAlteracao = DateTime.UtcNow;
            var resultado = _repo.Merge(entidade);
            return resultado;
        }

        public virtual async Task<T> MergeAsync(T entidade)
        {
            if (!Validacoes(entidade))
                return entidade;
            entidade.UltimaAlteracao = DateTime.UtcNow;
            var resultado = await _repo.MergeAsync(entidade);
            return resultado;
        }

        public virtual bool Exclui(T[] entidades, Func<bool> processo)
        {
            if (entidades.Length == 0)
                return true;
            if (!entidades.All(Validacoes))
                return false;
            var sucesso = processo();
            return sucesso;
        }

        public virtual async Task<bool> ExcluiAsync(T[] entidades, Func<Task<bool>> processo)
        {
            if (entidades.Length == 0)
                return true;
            if (!entidades.All(Validacoes))
                return false;
            var sucesso = await processo();
            return sucesso;
        }
    }
}
