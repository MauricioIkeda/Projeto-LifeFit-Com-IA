using FGB.Dominio.Repositorios.IRepositorios;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace FGB.Dominio.Repositorios
{
    namespace FGB.Infra
    {
        public class RepositorioSessaoEF : IRepositorioSessao
        {
            private readonly DbContext _context;
            private IDbContextTransaction? _transacao;

            public RepositorioSessaoEF(DbContext context)
            {
                _context = context;
            }

            public IRepositorioConsulta GetRepositorioConsulta()
            {
                return new RepositorioConsultaEF(_context);
            }

            public IRepositorio GetRepositorio()
            {
                return new RepositorioEF(_context);
            }

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
