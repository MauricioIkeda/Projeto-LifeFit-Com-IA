using FGB.Dominio.Entidades;
using LifeFit.Dominio.ObjetosValor;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LifeFit.Dominio.Entidades
{
    public class PerfilUsuario : EntidadeBase
    {
        public string Nome { get; set; } = string.Empty;
        [JsonRequired]
        public SexoEnum Sexo { get; set; }
        public float Peso { get; set; }
        public int Altura { get; set; } // Em cm
        [JsonRequired]
        public int Idade { get; set; }
        [JsonRequired]
        public NivelAtividadeFisica NivelAtividadeFisica { get; set; }
        [JsonRequired]
        public ObjetivoUsuario Objetivo { get; set; }
        [JsonRequired]
        public FocoMuscular Foco { get; set; }
    }
}
