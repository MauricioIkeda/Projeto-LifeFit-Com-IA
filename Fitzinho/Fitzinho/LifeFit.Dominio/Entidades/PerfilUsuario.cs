using FGB.Dominio.Entidades;
using LifeFit.Dominio.ObjetosValor;

namespace LifeFit.Dominio.Entidades
{
    public class PerfilUsuario : EntidadeBase
    {
        public string Nome { get; set; }
        public SexoEnum Sexo { get; set; }
        public float Peso { get; set; }
        public int Altura { get; set; } // Em cm
        public DateTime DataNascimento { get; set; }
        public NivelAtividadeFisica NivelAtividadeFisica { get; set; }
        public ObjetivoUsuario Objetivo { get; set; }
        public FocoMuscular Foco { get; set; }
    }
}
