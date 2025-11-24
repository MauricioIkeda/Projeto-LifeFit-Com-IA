using FGB.Dominio.Entidades;
using LifeFit.Dominio.ObjetosValor;

namespace LifeFit.Dominio.Entidades
{
    public class Exercicio : EntidadeBase
    {
        public  ExercicioEnum Nome { get; set; }
        public FocoMuscular FocoMuscular { get; set; }
    }
}
