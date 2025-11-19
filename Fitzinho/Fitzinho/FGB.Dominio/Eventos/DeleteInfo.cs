using FGB.Dominio.Entidades;

namespace FGB.Dominio.Eventos
{
    public delegate void DeleteHandler<T>(DeleteInfo<T> info) where T : EntidadeBase;
    public class DeleteInfo<T> where T : EntidadeBase
    {
        public T Entidade { get; set; }
        public DeleteInfo(T entidadeExcluida)
        {
            Entidade = entidadeExcluida;
        }

    }
}
