using FGB.Dominio.Entidades;
using FGB.Dominio.Validacao;
using System.Text.Json.Serialization;

namespace LifeFit.Dominio.Entidades
{
    public class Sugestao : EntidadeBase
    {
        public int Rank { get; set; }
        public long PerfilUsuarioId { get; set; }
        [JsonIgnore]
        public PerfilUsuario PerfilUsuario { get; set; }
        public long ExercicioId { get; set; }
        public Exercicio Exercicio { get; set; }
        public long RequisicaoId { get; set; }
        public string NomeExercicio { get; set; }
        public string FocoMuscular { get; set; }
        [JsonIgnore]
        public RequisicaoSugestao Requisicao { get; set; }
        public string PontosPerfil { get; set; }
    }
}
