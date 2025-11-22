using FGB.Dominio.Entidades;
using System.Text.Json.Serialization;

namespace LifeFit.Dominio.Entidades
{
    public class Sugestao : EntidadeBase
    {
        
        public long PerfilUsuarioId { get; set; }
        [JsonIgnore]
        public PerfilUsuario PerfilUsuario { get; set; }
        public long ExercicioId { get; set; }
        [JsonIgnore]
        public Exercicio Exercicio { get; set; }
        public long RequisicaoId { get; set; }
        [JsonIgnore]
        public RequisicaoSugestao Requisicao { get; set; }
        public string PontosPerfil { get; set; }
    }
}
