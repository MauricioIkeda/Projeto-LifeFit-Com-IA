using FGB.Dominio.Repositorios.IRepositorios;
using FGB.Entidades;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace FGB.Dominio.Repositorios
{
    public class RepositorioEF : IRepositorio
    {
        private readonly DbContext _context;

        public RepositorioEF(DbContext context)
        {
            _context = context;
        }

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

    }
}
