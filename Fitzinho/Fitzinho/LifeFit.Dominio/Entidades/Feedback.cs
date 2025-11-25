using FGB.Dominio.Entidades;
using LifeFit.Dominio.ObjetosValor;
using System.Text.Json.Serialization;

namespace LifeFit.Dominio.Entidades
{
    public class Feedback : EntidadeBase
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.Never)]
        public FeedBackEnum Avaliacao { get; set; }
        public long sugestaoId { get; set; }
        [JsonIgnore]
        public Sugestao? sugestao { get; set; }
    }
}
