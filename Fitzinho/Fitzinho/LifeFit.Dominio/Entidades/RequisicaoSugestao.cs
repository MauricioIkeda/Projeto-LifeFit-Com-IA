using FGB.Dominio.Entidades;
using LifeFit.Dominio.ObjetosValor;
using System.Text.Json.Serialization;

namespace LifeFit.Dominio.Entidades
{
    public class RequisicaoSugestao : EntidadeBase
    {
        public long PerfilUsuarioId { get; set; }
        [JsonIgnore]
        public PerfilUsuario PerfilUsuario { get; set; }
        public List<Sugestao> Sugestoes { get; set; }
        public FocoMuscular FocoMuscular { get; set; }
        public string CodigoRetorno { get; set; }
    }
}
