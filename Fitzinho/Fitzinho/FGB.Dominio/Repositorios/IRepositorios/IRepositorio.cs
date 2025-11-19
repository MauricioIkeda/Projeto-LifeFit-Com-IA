using FGB.Dominio.Entidades;
using System.Linq.Expressions;

namespace FGB.Dominio.Repositorios.IRepositorios
{
    public interface IRepositorio : IDisposable
    {
        // ---------------------------------------------- CUD
        void Inclui<T>(T entidade) where T : EntidadeBase;
        Task IncluiAsync<T>(T entidade) where T : EntidadeBase;

        void Upsert<T>(T entidade) where T : EntidadeBase;
        Task UpsertAsync<T>(T entidade) where T : EntidadeBase;

        T Merge<T>(T entidade) where T : EntidadeBase;
        Task<T> MergeAsync<T>(T entidade) where T : EntidadeBase;

        void Exclui<T>(T entidade) where T : EntidadeBase;
        Task ExcluiAsync<T>(T entidade) where T : EntidadeBase;

        Task FlushAsync();
        void Flush();

        // ----------------------------------------------- R
        T Retorna<T>(long id) where T : EntidadeBase;

        IQueryable<T> Consulta<T>() where T : EntidadeBase;

        IQueryable<T> Consulta<T>(Expression<Func<T, bool>> where) where T : EntidadeBase;

        Task<T> RetornaAsync<T>(long id) where T : EntidadeBase;

        // -----------------------------------------------

        IDisposable IniciaTransacao();

        void CommitaTransacao();

        void RollBackTransacao();

        Task CommitaTransacaoAsync();

        Task RollBackTransacaoAsync();
    }
}
