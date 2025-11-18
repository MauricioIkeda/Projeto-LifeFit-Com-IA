using FGB.Entidades;
using System.Linq.Expressions;


namespace FGB.Dominio.Repositorios.IRepositorios
{
    public interface IRepositorioConsulta
    {
        T Retorna<T>(long id) where T : EntidadeBase;

        IQueryable<T> Consulta<T>() where T : EntidadeBase;

        IQueryable<T> Consulta<T>(Expression<Func<T, bool>> where) where T : EntidadeBase;

        Task<T> RetornaAsync<T>(long id) where T : EntidadeBase;
    }

}
