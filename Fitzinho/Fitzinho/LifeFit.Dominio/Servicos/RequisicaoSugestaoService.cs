using FGB.Dominio.Repositorios.IRepositorios;
using FGB.Dominio.Servicos;
using LifeFit.Dominio.DTO.PythonApi;
using LifeFit.Dominio.Entidades;
using LifeFit.Dominio.Servicos;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;

public class RequisicaoSugestaoService : ServicoConsulta<RequisicaoSugestao>
{
    private readonly HttpClient _http;
    private readonly SugestaoServico _sugestaoServico;
    private readonly string apiIaUrl = "http://localhost:8000/api/v1/recommend";

    public RequisicaoSugestaoService(IRepositorio repo, SugestaoServico sugestaoServico)
        : base(repo)
    {
        _sugestaoServico = sugestaoServico;
        _http = new HttpClient();
    }

    public async Task<RequisicaoSugestao> FazerRequisicao(PerfilUsuario perfilUsuario)
    {
        var requisicao = new SugestaoRequest
        {
            peso = perfilUsuario.Peso,
            altura = perfilUsuario.Altura,
            idade = DateTime.Now.Year - perfilUsuario.DataNascimento.Year,
            genero = perfilUsuario.Sexo,
            atividade = perfilUsuario.NivelAtividadeFisica,
            objetivo = perfilUsuario.Objetivo,
            foco_muscular = perfilUsuario.Foco
        };

        var resposta = await _http.PostAsJsonAsync(apiIaUrl, requisicao);
        resposta.EnsureSuccessStatusCode();

        var sugestoesResp = await resposta.Content.ReadFromJsonAsync<List<SugestaoResponse>>();

        var requisicaoEntidade = new RequisicaoSugestao
        {
            PerfilUsuario = perfilUsuario,
            FocoMuscular = perfilUsuario.Foco,
            Sugestoes = sugestoesResp.Select(r => new Sugestao
            {
                ExercicioId = r.exercicio_id,
                PontosPerfil = r.match_score,
                PerfilUsuario = perfilUsuario
            }).ToList()
        };

        _repo.Inclui(requisicaoEntidade);

        return requisicaoEntidade;
    }

}
