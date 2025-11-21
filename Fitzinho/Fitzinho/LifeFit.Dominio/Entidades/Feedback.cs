using LifeFit.Dominio.ObjetosValor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace LifeFit.Dominio.Entidades
{
    public class Feedback
    {
        public FeedBackEnum Avaliacao { get; set; }
        public long sugestaoId { get; set; }
        [JsonIgnore]
        public Sugestao sugestao { get; set; }
    }
}
