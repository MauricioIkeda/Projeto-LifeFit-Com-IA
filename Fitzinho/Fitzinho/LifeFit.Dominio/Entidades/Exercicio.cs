using FGB.Dominio.Entidades;
using LifeFit.Dominio.ObjetosValor;
using System.Text.Json.Serialization;

namespace LifeFit.Dominio.Entidades
{
    public class Exercicio : EntidadeBase
    {
        public string Nome { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.Never)]
        public ExercicioEnum Enum { get; set; }
        public FocoMuscular FocoMuscular { get; set; }
        public string FocoMuscularNome { get; set; }
    }
}
