using AutoMapper;
using FGB.Api.Controllers;
using LifeFit.Dominio.Entidades;
using LifeFit.Dominio.Servicos;

namespace FitzinhoAPI.Controllers
{
    public class SugestaoController : ApiConsultaController<Sugestao, Sugestao>
    {
        public SugestaoController(SugestaoServico servico, IMapper mapper) : base(servico, mapper)
        {
        }
    }
}
