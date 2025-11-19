using FGB.Dominio.Repositorios.IRepositorios;
using FGB.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Linq.Expressions;

namespace FGB.Dominio.Repositorios
{
    namespace FGB.Infra
    {
        public class RepositorioEF : IRepositorio
        {
            private readonly DbContext _context;
            private IDbContextTransaction? _transacao;

            public RepositorioEF(DbContext context)
            {
                _context = context;
            }
            // -----------------------------------------------
            public T Retorna<T>(long id) where T : EntidadeBase
            {
                return _context.Set<T>().Find(id);
            }
            public async Task<T> RetornaAsync<T>(long id) where T : EntidadeBase
            {
                return await _context.Set<T>().FindAsync(id);
            }
            public IQueryable<T> Consulta<T>() where T : EntidadeBase
            {
                return _context.Set<T>()
                    .AsNoTracking()
                    .AsQueryable();
            }
            public IQueryable<T> Consulta<T>(Expression<Func<T, bool>> where) where T : EntidadeBase
            {
                return _context.Set<T>()
                    .AsNoTracking()
                    .Where(where);
            }

            // -----------------------------------------------

            public void Inclui<T>(T entidade) where T : EntidadeBase
            {
                _context.Set<T>().Add(entidade);
                _context.SaveChanges();
            }

            public async Task IncluiAsync<T>(T entidade) where T : EntidadeBase
            {
                await _context.Set<T>().AddAsync(entidade);
                await _context.SaveChangesAsync();
            }

            public void Upsert<T>(T entidade) where T : EntidadeBase
            {
                // Se tem Id > 0, assume-se update; senão, insert
                if (_context.Entry(entidade).IsKeySet)
                    _context.Set<T>().Update(entidade);
                else
                    _context.Set<T>().Add(entidade);

                _context.SaveChanges();
            }

            public async Task UpsertAsync<T>(T entidade) where T : EntidadeBase
            {
                if (_context.Entry(entidade).IsKeySet)
                    _context.Set<T>().Update(entidade);
                else
                    await _context.Set<T>().AddAsync(entidade);

                await _context.SaveChangesAsync();
            }

            public T Merge<T>(T entidade) where T : EntidadeBase
            {
                _context.Entry(entidade).State = EntityState.Modified;
                _context.SaveChanges();
                return entidade;
            }

            public async Task<T> MergeAsync<T>(T entidade) where T : EntidadeBase
            {
                _context.Entry(entidade).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return entidade;
            }

            public void Exclui<T>(T entidade) where T : EntidadeBase
            {
                _context.Set<T>().Remove(entidade);
                _context.SaveChanges();
            }

            public async Task ExcluiAsync<T>(T entidade) where T : EntidadeBase
            {
                _context.Set<T>().Remove(entidade);
                await _context.SaveChangesAsync();
            }

            public async Task FlushAsync()
            {
                await _context.SaveChangesAsync();
            }

            public void Flush()
            {
                _context.SaveChanges();
            }

            // -----------------------------------------------

            public IDisposable IniciaTransacao()
            {
                _transacao = _context.Database.BeginTransaction();
                return _transacao;
            }

            public void CommitaTransacao()
            {
                _transacao?.Commit();
            }

            public void RollBackTransacao()
            {
                _transacao?.Rollback();
            }

            public async Task CommitaTransacaoAsync()
            {
                if (_transacao != null)
                    await _transacao.CommitAsync();
            }

            public async Task RollBackTransacaoAsync()
            {
                if (_transacao != null)
                    await _transacao.RollbackAsync();
            }

            public void Dispose()
            {
                _transacao?.Dispose();
                _context.Dispose();
            }
        }
    }
}
