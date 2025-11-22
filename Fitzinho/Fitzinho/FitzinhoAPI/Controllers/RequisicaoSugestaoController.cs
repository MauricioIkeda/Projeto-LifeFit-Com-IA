using AutoMapper;
using FGB.Api.Controllers;
using LifeFit.Dominio.Entidades;
using Microsoft.AspNetCore.Mvc;

namespace FitzinhoAPI.Controllers
{
    public class RequisicaoSugestaoController : ApiConsultaController<RequisicaoSugestao, RequisicaoSugestao>
    {
        RequisicaoSugestaoServico _servico;
        public RequisicaoSugestaoController(RequisicaoSugestaoServico servico, IMapper mapper) : base (servico, mapper)
        {
            _servico = servico;
        }

        [HttpPost("GerarSugestoes")]
        public async Task<IActionResult> GerarSugestoes([FromBody] PerfilUsuario perfilUsuario)
        {
            if (perfilUsuario == null)
                return BadRequest("Perfil do usuário não pode ser nulo.");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var resultado = await _servico.FazerRequisicao(perfilUsuario);
            return Ok(resultado);
        }
    }
}
