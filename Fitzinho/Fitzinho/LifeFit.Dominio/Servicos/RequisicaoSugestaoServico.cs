using FGB.Dominio.Repositorios.IRepositorios;
using FGB.Dominio.Servicos;
using LifeFit.Dominio.DTO.PythonApi;
using LifeFit.Dominio.Entidades;
using LifeFit.Dominio.ObjetosValor;
using LifeFit.Dominio.Servicos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

public class RequisicaoSugestaoServico : ServicoConsulta<RequisicaoSugestao>
{
    private readonly HttpClient _http;
    private readonly string apiIaUrl = "http://localhost:8000/api/v1/recommend";

    public RequisicaoSugestaoServico(IRepositorio repo, SugestaoServico sugestaoServico)
        : base(repo)
    {
        _http = new HttpClient();
    }

    public async Task<RequisicaoSugestao> FazerRequisicao(PerfilUsuario perfilUsuario)
    {
        var requisicao = new SugestaoRequest
        {
            peso = perfilUsuario.Peso,
            altura = perfilUsuario.Altura,
            idade = perfilUsuario.Idade,
            genero = perfilUsuario.Sexo,
            atividade = perfilUsuario.NivelAtividadeFisica,
            objetivo = perfilUsuario.Objetivo,
            foco_muscular = perfilUsuario.Foco
        };

        var resposta = await _http.PostAsJsonAsync(apiIaUrl, requisicao);

        // 🚨 Tratamento de erro antes de tentar ler JSON
        if (!resposta.IsSuccessStatusCode)
        {
            var codigo = (int)resposta.StatusCode;
            var motivo = resposta.ReasonPhrase ?? "Erro desconhecido";

            var requisicaoErro = new RequisicaoSugestao
            {
                PerfilUsuario = perfilUsuario,
                FocoMuscular = perfilUsuario.Foco,
                CodigoRetorno = $"{codigo} - {motivo}",
                Sugestoes = new List<Sugestao>()
            };

            _repo.Inclui(requisicaoErro);

            return requisicaoErro;
        }

        // Aqui é 200 e alguma coisa
        var sugestoesResp = await resposta.Content.ReadFromJsonAsync<List<SugestaoResponse>>();

        var requisicaoEntidade = new RequisicaoSugestao
        {
            PerfilUsuario = perfilUsuario,
            FocoMuscular = perfilUsuario.Foco,
            CodigoRetorno = "200",
            Sugestoes = sugestoesResp.Select(r =>
            {
                var enumExercicio = (ExercicioEnum)r.exercicio_id;

                var exercicio = _repo.Consulta<Exercicio>()
                    .FirstOrDefault(e => e.Enum == enumExercicio);

                if (exercicio == null)
                    throw new Exception($"Exercício não encontrado para enum: {enumExercicio}");

                return new Sugestao
                {
                    Rank = r.rank,
                    ExercicioId = exercicio.Id,
                    Exercicio = null,
                    PontosPerfil = r.match_score,
                    PerfilUsuario = perfilUsuario
                };
            }).ToList()
        };

        _repo.Inclui(requisicaoEntidade);

        return requisicaoEntidade;
    }

}
