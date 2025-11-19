using FGB.Dominio.Entidades;

namespace FGB.Dominio.Eventos
{
    public delegate void IncluiHandler<T>(IncluiInfo<T> info) where T : EntidadeBase;
    public class IncluiInfo<T> where T : EntidadeBase
    {
        public T Entidade { get; set; }
        public IncluiInfo(T entidadeIncluida)
        {
            Entidade = entidadeIncluida;
        }
    }
}
