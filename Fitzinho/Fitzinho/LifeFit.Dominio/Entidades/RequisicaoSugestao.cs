using FGB.Dominio.Entidades;
using FGB.Dominio.Validacao;
using LifeFit.Dominio.ObjetosValor;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace LifeFit.Dominio.Entidades
{
    public class RequisicaoSugestao : EntidadeBase
    {
        [Obrigar]
        public long PerfilUsuarioId { get; set; }
        [JsonIgnore]
        public PerfilUsuario PerfilUsuario { get; set; }
        public List<Sugestao> Sugestoes { get; set; }
        [JsonRequired]
        public FocoMuscular FocoMuscular { get; set; }
        public string CodigoRetorno { get; set; }
    }
}
