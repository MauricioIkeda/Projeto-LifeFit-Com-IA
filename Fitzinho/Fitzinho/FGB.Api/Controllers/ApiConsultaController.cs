using AutoMapper;
using AutoMapper.QueryableExtensions;
using FGB.Dominio.Entidades;
using FGB.Dominio.Servicos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;

namespace FGB.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class ApiConsultaController<T, TDto>: ControllerBase
        where T : EntidadeBase
    {
        protected readonly ServicoConsulta<T> _servicoConsulta;
        protected readonly IMapper _mapper;

        protected ApiConsultaController(ServicoConsulta<T> servico, IMapper mapper)
        {
            _servicoConsulta = servico;
            _mapper = mapper;
        }

        [HttpGet("{id:long}")]
        public virtual IActionResult GetById(long id)
        {
            var entidade = _servicoConsulta.Retorna(id);
            if (entidade == null)
                return NotFound(new {mensagem = $"{typeof(T).Name} não encontrado"});

            if (typeof(T) != typeof(TDto))
            {
                var dto = _mapper.Map<TDto>(entidade);
                return Ok(dto);
            }

            else
                return Ok(entidade);
        }

        [HttpGet]
        [EnableQuery]
        public virtual IActionResult GetOData()
        {
            if (typeof(T) != typeof(TDto))
            {
                var queryDto = _servicoConsulta.Consulta()
                    .ProjectTo<TDto>(_mapper.ConfigurationProvider);
                return Ok(queryDto);
            }
            else
            {
                var query = _servicoConsulta.Consulta();
                return Ok(query);
            }
        }
    }
}
