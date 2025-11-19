using FGB.Dominio.Entidades;

namespace FGB.Dominio.Eventos
{
    public delegate void MergeHandler<T>(MergeInfo<T> info) where T : EntidadeBase;
    public class MergeInfo<T>     where T : EntidadeBase
    {
        public T EntidadeAntiga { get; set; }
        public T EntidadeNova { get; set; }
        public MergeInfo(T entidadeAntiga, T entidadeNova)
        {
            EntidadeAntiga = entidadeAntiga;
            EntidadeNova = entidadeNova;
        }
    }
}
