using AutoMapper;
using FGB.Api.Controllers;
using LifeFit.Dominio.Entidades;
using LifeFit.Dominio.Servicos;
using Microsoft.AspNetCore.Mvc;

namespace FitzinhoAPI.Controllers
{
    public class ExercicioController : ApiConsultaController<Exercicio, Exercicio>
    {
        private readonly ExercicioServico _servicoCrud;
        public ExercicioController(ExercicioServico servico, IMapper mapper) : base(servico, mapper)
        {
            _servicoCrud = servico;
        }

        [HttpPatch("{id:long}")]
        public virtual IActionResult MudarNome(long id, string nome)
        {
            var exercicio = _servicoConsulta.Retorna(id);
            exercicio.Nome = nome;
            _servicoCrud.Merge(exercicio);

            return Ok(new { mensagem = $"Exercio atualizado com sucesso.", exercicio });

        }
    }
}
