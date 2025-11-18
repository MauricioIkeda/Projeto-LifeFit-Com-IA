using FGB.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FGB.Dominio.Repositorios.IRepositorios
{
    public interface IRepositorio
    {
        void Inclui<T>(T entidade) where T : EntidadeBase;
        Task IncluiAsync<T>(T entidade) where T : EntidadeBase;

        void Upsert<T>(T entidade) where T : EntidadeBase;
        Task UpsertAsync<T>(T entidade) where T : EntidadeBase;

        T Merge<T>(T entidade) where T : EntidadeBase;
        Task<T> MergeAsync<T>(T entidade) where T : EntidadeBase;

        void Exclui<T>(T entidade) where T : EntidadeBase;
        Task ExcluiAsync<T>(T entidade) where T : EntidadeBase;

        Task FlushAsync();
    }

}
