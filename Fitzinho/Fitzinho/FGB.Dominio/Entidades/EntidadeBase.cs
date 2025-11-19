namespace FGB.Dominio.Entidades
{
    public class EntidadeBase
    {
        public long Id { get; set; }

        public DateTime? CriadoEm { get; set; }

        public DateTime? UltimaAlteracao { get; set; }
    }
}
