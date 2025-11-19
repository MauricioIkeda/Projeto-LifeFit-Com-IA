using AutoMapper;
using FGB.Dominio.Entidades;
using FGB.Dominio.Servicos;
using Microsoft.AspNetCore.Mvc;

namespace FGB.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApiCrudController<T, TDto> : ApiConsultaController<T, TDto>
        where T : EntidadeBase
    {
        protected readonly ServicoCrud<T> _servicoCrud;
        protected ApiCrudController(ServicoCrud<T> servico, IMapper mapper)
            : base(servico, mapper)
        {
            _servicoCrud = servico;
        }

        [HttpPost]
        public virtual IActionResult Post([FromBody] T entidade)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (_servicoCrud.Inclui(new[] { entidade }))
                return Ok(new { mensagem = $"{typeof(T).Name} cadastrado com sucesso.", entidade });

            return UnprocessableEntity(_servicoCrud.Mensagens);
        }


        [HttpPut("{id:long}")]
        public virtual IActionResult Put(long id, [FromBody] T entidade)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            entidade.Id = id;

            var atualizado = _servicoCrud.Merge(entidade);
            if (atualizado != null)
                return Ok(new { mensagem = $"{typeof(T).Name} atualizado com sucesso.", entidade });

            return UnprocessableEntity(_servicoCrud.Mensagens);
        }

        [HttpDelete("{id:long}")]
        public virtual IActionResult Delete(long id)
        {
            var removido = _servicoCrud.Exclui(id);
            if (removido != null)
                return Ok(new { mensagem = $"{typeof(T).Name} excluído com sucesso." });

            return UnprocessableEntity(_servicoCrud.Mensagens);
        }
    }
}
