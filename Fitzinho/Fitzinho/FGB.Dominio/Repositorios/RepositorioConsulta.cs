using FGB.Dominio.Repositorios.IRepositorios;
using FGB.Entidades;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FGB.Dominio.Repositorios
{
    public class RepositorioConsultaEF : IRepositorioConsulta
    {
        private readonly DbContext _context;

        public RepositorioConsultaEF(DbContext context)
        {
            _context = context;
        }

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
    }
}
