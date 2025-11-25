using FGB.Dominio.Entidades;
using LifeFit.Dominio.ObjetosValor;

namespace LifeFit.Dominio.Entidades
{
    public class Exercicio : EntidadeBase
    {
        public string Nome { get; set; }
        public  ExercicioEnum Enum { get; set; }
        public FocoMuscular FocoMuscular { get; set; }
        public string FocoMuscularNome { get; set; }
    }
}
