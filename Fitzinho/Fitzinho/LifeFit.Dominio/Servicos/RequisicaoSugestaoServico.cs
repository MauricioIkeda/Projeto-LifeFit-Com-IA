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
        var perfilBanco = _repo.Consulta<PerfilUsuario>()
                               .FirstOrDefault(p => p.Id == perfilUsuario.Id);
        if (perfilBanco == null) {
            perfilBanco = perfilUsuario;
            _repo.Inclui(perfilBanco);
        }

        var requisicao = new SugestaoRequest
        {
            peso = perfilBanco.Peso,
            altura = perfilBanco.Altura,
            idade = perfilBanco.Idade,
            genero = perfilBanco.Sexo,
            atividade = perfilBanco.NivelAtividadeFisica,
            objetivo = perfilBanco.Objetivo,
            foco_muscular = perfilBanco.Foco
        };

        var resposta = await _http.PostAsJsonAsync(apiIaUrl, requisicao);

        if (!resposta.IsSuccessStatusCode)
        {
            var requisicaoErro = new RequisicaoSugestao
            {
                PerfilUsuarioId = perfilBanco.Id,
                FocoMuscular = perfilBanco.Foco,
                CodigoRetorno = $"{(int)resposta.StatusCode} - {resposta.ReasonPhrase}",
                Sugestoes = new List<Sugestao>()
            };

            _repo.Inclui(requisicaoErro);
            return requisicaoErro;
        }

        var sugestoesResp = await resposta.Content.ReadFromJsonAsync<List<SugestaoResponse>>();

        var requisicaoEntidade = new RequisicaoSugestao
        {
            PerfilUsuarioId = perfilBanco.Id,
            FocoMuscular = perfilBanco.Foco,
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
                    NomeExercicio = exercicio.Nome,
                    FocoMuscular = exercicio.FocoMuscularNome,
                    PontosPerfil = r.match_score,
                    PerfilUsuarioId = perfilBanco.Id
                };
            }).ToList()
        };

        _repo.Inclui(requisicaoEntidade);

        return requisicaoEntidade;
    }
}
