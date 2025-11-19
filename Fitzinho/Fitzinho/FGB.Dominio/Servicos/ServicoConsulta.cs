using FGB.Dominio.Repositorios.IRepositorios;
using FGB.Dominio.Entidades;

namespace FGB.Dominio.Servicos
{
    public class ServicoConsulta<T>
    where T : EntidadeBase
    {
        protected IRepositorio _repo;
        public ListaMensagens Mensagens { get; protected set; }

        public ServicoConsulta(IRepositorio repo)
        {
            _repo = repo;
            Mensagens = new ListaMensagens();
        }

        public virtual T Retorna(long id)
        {
            return _repo.Retorna<T>(id);
        }

        public virtual async Task<T> RetornaAsync(long id)
        {
            return await _repo.RetornaAsync<T>(id);
        }

        public virtual IQueryable<T> Consulta()
        {
            return _repo.Consulta<T>();
        }
    }
}
