using FGB.Dominio.Entidades;
using FGB.Dominio.Validacao;
using LifeFit.Dominio.ObjetosValor;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LifeFit.Dominio.Entidades
{
    public class Feedback : EntidadeBase
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.Never), JsonRequired]
        public FeedBackEnum Avaliacao { get; set; }
        [Obrigar(typeof(Sugestao))]
        public long sugestaoId { get; set; }
        [JsonIgnore]
        public Sugestao? sugestao { get; set; }
    }
}
